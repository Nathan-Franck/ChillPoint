import { HtmlBuilder } from "./Util.HtmlBuilder";
import { Scripting } from "./Util.Scripting";
import { ShaderBuilder } from "./Util.ShaderBuilder";
import { SmoothCurve } from "./Util.SmoothCurve";
import { Vec2 } from "./Util.VecMath";

import { fromEvent, interval, zip } from "rxjs";
import { filter, map, mapTo, scan, withLatestFrom } from "rxjs/operators";

export namespace MouseAccuracy {

    export function generate_platform() {
        const platform = HtmlBuilder.create_children(document.body, {
            canvas: {
                type: "canvas",
                attributes: {
                    width: 1920,
                    height: 1080,
                },
                style: {
                    position: "absolute",
                    imageRendering: "pixelated",
                },
            }
        });
        const width = 16;
        const height = 9;
        const resize_canvas = () => {
            const { canvas } = platform;
            const t = [window.innerWidth / width, window.innerHeight / height];
            const min_t = Math.min(...t);
            HtmlBuilder.assign_to_element(canvas, {
                style: {
                    width: width * min_t,
                    height: height * min_t,
                    left: (window.innerWidth - width * min_t) * .5,
                    top: (window.innerHeight - height * min_t) * .5,
                    // cursor: "none",
                },
                attributes: {
                    width: width * min_t,
                    height: height * min_t,
                }
            });
        };
        window.onresize = resize_canvas;
        resize_canvas();

        return platform;
    }

    export async function play_game() {
        const { canvas } = generate_platform();
        const gl = canvas.getContext("webgl2", {
            desynchronized: false,
            preserveDrawingBuffer: true,
            antialias: true,
        })!;

        const settings = {
            quantum_size: 64,
            target_click_rate: 1.73333,
            target_persistence: 6,
        };

        const constant_binds = {
            vertices: ShaderBuilder.create_element_buffer(gl, Uint16Array.from([0, 1, 2, 2, 1, 3])),
            texture_coords: ShaderBuilder.create_buffer(gl, Float32Array.from([
                0, 0,
                1, 0,
                0, 1,
                1, 1,
            ])),
            pattern: await ShaderBuilder.load_texture(gl, "./images/fire pattern 2.png"),
            texture: await ShaderBuilder.load_texture(gl, "./images/elemental ball 2.png"),
        } as const;
        const cursor_binds = {
            texture: await ShaderBuilder.load_texture(gl, "./images/cursor.png"),
        } as const;
        const background_binds = {
            pattern: await ShaderBuilder.load_texture(gl, "./images/grid pattern.png"),
        } as const;

        const image_vert_source = `void main(void) {
            gl_Position = vec4((texture_coords * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0); 
            uv = texture_coords;
        }`;
        const constant_globals = {
            vertices: { type: "element" },
            texture_coords: { type: "attribute", unit: "vec2" },
            texture: { type: "uniform", unit: "sampler2D", count: 1 },
            uv: { type: "varying", unit: "vec2" },
            canvas_dimensions: { type: "uniform", unit: "vec2", count: 1 },
        } as const;
        const material = ShaderBuilder.generate_material(gl, {
            mode: "TRIANGLES",
            globals: {
                ...constant_globals,
                blend_color: { type: "uniform", unit: "vec4", count: 1 },
                scroll: { type: "uniform", unit: "float", count: 1 },
                pattern: { type: "uniform", unit: "sampler2D", count: 1 },
            },
            vert_source: image_vert_source,
            frag_source: `lowp float hue_to_uv() {
                lowp vec3 color = texture2D(texture, uv).rgb;
                lowp float min = min(min(color.r, color.g), color.b);
                lowp float max = max(max(color.r, color.g), color.b);
                lowp float diff = max - min;
                if (diff == 0.0) {
                    return 0.0;
                }
                lowp float hue = 0.0;
                if (max == color.r) {
                    hue = (color.g - color.b) / diff;
                } else if (max == color.g) {
                    hue = 2.0 + (color.b - color.r) / diff;
                } else {
                    hue = 4.0 + (color.r - color.g) / diff;
                }
                hue = hue / 6.0;
                return hue - floor(hue);
            }

            void main(void) {
                lowp float tex_uv = hue_to_uv() + scroll * 4.0;
                lowp float cool = tex_uv - floor(tex_uv);
                lowp vec4 pattern_color = texture2D(pattern, vec2(tex_uv * 1.0, 0.5));
                lowp float alpha = float(pattern_color.a * texture2D(texture, uv).a > .5);
                gl_FragColor = vec4(pattern_color.rgb * blend_color.rgb, alpha * blend_color.a);
            }`,
        });
        const cursor_material = ShaderBuilder.generate_material(gl, {
            mode: "TRIANGLES",
            globals: constant_globals,
            vert_source: image_vert_source,
            frag_source: `
            void main(void) {
                lowp vec4 tex_color = texture2D(texture, uv);
                gl_FragColor = tex_color;
            }`,
        });


        const tail_material = ShaderBuilder.generate_material(gl, {
            mode: "TRIANGLE_STRIP",
            globals: {
                canvas_dimensions: { type: "uniform", unit: "vec2", count: 1 },
                pattern: { type: "uniform", unit: "sampler2D", count: 1 },
                position: { type: "attribute", unit: "vec2" },
                distance: { type: "attribute", unit: "float" },
                uv: { type: "varying", unit: "float" },
            },
            vert_source: `void main(void) {
                    gl_Position = vec4((position / canvas_dimensions * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0);
                    uv = distance / ${settings.quantum_size / 2}.0;
                }`,
            frag_source: `void main(void) {
                gl_FragColor = texture2D(pattern, vec2(uv, 0.5)) * vec4(0.8, 0.8, 0.8, 1.0);
            }`,
        });
        const tail_binds = {
            canvas_dimensions: [canvas.width, canvas.height],
            pattern: await ShaderBuilder.load_texture(gl, "./images/dotted line pattern.png"),
        } as const;

        const background_material = ShaderBuilder.generate_material(gl, {
            mode: "TRIANGLES",
            globals: {
                ...constant_globals,
                grid_size: { type: "uniform", unit: "float", count: 1 },
                pattern: { type: "uniform", unit: "sampler2D", count: 1 },
                color: { type: "uniform", unit: "vec4", count: 1 },
            },
            vert_source: image_vert_source,
            frag_source: `void main(void) {
                lowp vec2 tex_uv = uv * canvas_dimensions / grid_size;
                lowp vec4 pattern_color = texture2D(pattern, tex_uv);
                gl_FragColor = pattern_color * color;
            }`,
        });

        type Target = {
            position: Vec2,
            spawn_time: number,
            despawn?: {
                time: number,
                cause: "hit" | "punish",
            },
        };

        // const visuals: Derivative<{ tail: { position: Vec2, distance: number }[] }> = derivative((previous) => {
        //     const last_first = previous?.tail[0];
        //     const { mouse_position } = model;
        //     const distance_offset = last_first == null ? 10000 : Vec2.dist(mouse_position, last_first.position);
        //     const max_length = 1000;
        //     if (distance_offset < 10) {
        //         return { tail: previous?.tail || [] };
        //     }
        //     return {
        //         tail: [
        //             {
        //                 position: model.mouse_position,
        //                 distance: 0,
        //             },
        //             ...(previous?.tail.map(particle => ({
        //                 ...particle,
        //                 distance: particle.distance + distance_offset,
        //             })).filter(particle => particle.distance <= max_length) || []),
        //         ],
        //     }
        // });

        const canvas_dimensions = fromEvent<UIEvent>(canvas, "resize").pipe(
            map(event => [canvas.width, canvas.height] as const),
        );

        const mouse_position = fromEvent<MouseEvent>(canvas, "mousemove").pipe(
            map(e => Vec2.mul(
                [canvas.width, canvas.height],
                Vec2.div(
                    [e.offsetX, e.offsetY],
                    [canvas.clientWidth, canvas.clientHeight]))),
        );

        const targets = interval(1000 / settings.target_click_rate).pipe(
            mapTo([Math.random(), Math.random()] as const),
            withLatestFrom(canvas_dimensions),
            map(([position, canvas_dimensions]) => Vec2.map(position, (value, index) =>
                (Math.floor(value * canvas_dimensions[index] / settings.quantum_size) + 0.5) * settings.quantum_size)),
            scan((targets, position) => ([
                ...targets,
                <Target>{
                    position,
                    spawn_time: get_time(),
                },
            ]), [])
        );

        const mouse_down = fromEvent<MouseEvent>(canvas, "mousedown");
        const get_time = () => Date.now() / 1000;
        const simulation_time = interval(1000/30).pipe(mapTo(get_time()));
        const clicks = mouse_down.pipe(scan(clicks => clicks + 1, 0));
        const hits = mouse_down.pipe(
            withLatestFrom(zip(mouse_position, targets, simulation_time)),
            map(([_, [mouse_position, targets, simulation_time]]) => {
                return targets.find(target =>
                    target.despawn == null &&
                    Vec2.dist(target.position, mouse_position) < target_diameter(
                        simulation_time - target.spawn_time, target) * 0.5);
            }),
            filter((hit): hit is Target => hit != null),
        );
        const hits_count = hits.pipe(scan((count) => count + 1, 0));

        const readout_style = {
            position: "absolute",
            left: "10px",
            top: "1em",
            zIndex: 10,

            color: "white",
            fontFamily: "monospace",
        } as const;

        const elements = HtmlBuilder.create_children(document.body, {
            fps: {
                type: "div",
                style: readout_style,
            },
            hits: {
                type: "div",
                style: {
                    ...readout_style,
                    top: "2em",
                },
            },
            clicks: {
                type: "div",
                style: {
                    ...readout_style,
                    top: "3em",
                },
            },
        });


        const diameter_curve: SmoothCurve = {
            x_range: [0, settings.target_persistence],
            y_values: [0, 1, 1, 1, .5, .5, 0],
        }

        const despawn_fade_curve: SmoothCurve = {
            x_range: [0, 2],
            y_values: [1, .2, .1, 0],
        }

        const target_diameter = (time: number, target: Target) => {
            return settings.quantum_size * SmoothCurve.sample(diameter_curve, time);
        }

        let frame_times: readonly number[] = [];

        zip(targets, mouse_position, simulation_time, canvas_dimensions, clicks, hits_count).subscribe(
            ([targets, mouse_position, simulation_time, canvas_dimensions, clicks, hits_count]) => {

            gl.clearColor(.2, .2, .2, 1);
            gl.disable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.BLEND)
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            // 😁 Grid background
            gl.viewport(0, 0, ...canvas_dimensions);
            ShaderBuilder.render_material(gl, background_material, {
                ...constant_binds,
                ...background_binds,
                canvas_dimensions,
                grid_size: settings.quantum_size,
                color: [1, 1, 1, .2],
            });

            // 🎯 Targets
            targets.map(target => {
                if (target.despawn != null)
                    return;
                const scale = target_diameter(simulation_time - target.spawn_time, target);
                gl.viewport(
                    scale * -0.5 + target.position[0],
                    scale * -0.5 + canvas_dimensions[1] - 1 - target.position[1],
                    scale,
                    scale);
                ShaderBuilder.render_material(gl, material, {
                    ...constant_binds,
                    canvas_dimensions,
                    blend_color: [1, 1, 1, 1],
                    scroll: -(simulation_time - target.spawn_time) * 1.619 * .2,
                });
            });

            // ☁ Despawned targets
            targets.map(target => {
                if (target.despawn == null)
                    return;
                const scale = target_diameter(target.despawn.time - target.spawn_time, target);
                const time = simulation_time - target.despawn.time;
                gl.viewport(
                    scale * -0.5 + target.position[0],
                    scale * -0.5 + canvas_dimensions[1] - 1 - target.position[1],
                    scale,
                    scale);
                const color = target.despawn.cause == "punish" ?
                    [1, 0, 0] as const :
                    [0, 1, 0] as const;
                ShaderBuilder.render_material(gl, material, {
                    ...constant_binds,
                    canvas_dimensions,
                    blend_color: [...color, SmoothCurve.sample(despawn_fade_curve, time)],
                    scroll: -(simulation_time - target.spawn_time) * 1.619 * .2,
                });
            });

            // // 🐒 Tail
            // gl.viewport(0, 0, ...canvas_dimensions);
            // const { tail } = visuals;
            // if (tail.length > 2) {
            //     const pixel_thickness = 0.5;
            //     const positions = new Float32Array(tail.length * 4);
            //     positions.set(tail.
            //         flatMap(({ position }, index) => {
            //             const next_position = index < tail.length - 1 ?
            //                 tail[index + 1].position :
            //                 Vec2.add(
            //                     position,
            //                     Vec2.sub(
            //                         position,
            //                         tail[index - 1].position));
            //             const diff = Vec2.sub(next_position, position);
            //             const perp = Vec2.scale(
            //                 Vec2.normal([diff[1], -diff[0]]),
            //                 pixel_thickness);
            //             return [
            //                 ...Vec2.add(position, perp),
            //                 ...Vec2.sub(position, perp)];
            //         }));
            //     const distances = new Float32Array(tail.length * 2);
            //     distances.set(tail.flatMap(({ distance }) => [distance, distance]));
            //     ShaderBuilder.render_material(gl, tail_material, {
            //         ...tail_binds,
            //         distance: ShaderBuilder.create_buffer(gl, distances),
            //         position: ShaderBuilder.create_buffer(gl, positions),
            //     });
            // }

            // // 👆 Rendered pointer - Good For Latency Debug
            // const width = cursor_binds.texture.width;
            // const height = cursor_binds.texture.height;
            // gl.viewport(
            //     mouse_position[0],
            //     -height + canvas_dimensions[1] - 1 - mouse_position[1],
            //     width,
            //     height);
            // ShaderBuilder.render_material(gl, cursor_material, {
            //     ...constant_binds,
            //     ...cursor_binds,
            //     canvas_dimensions,
            // });

            gl.flush();

            const current_time = get_time();

            frame_times = [
                ...frame_times.filter(frame_time =>
                    frame_time + 1 >= current_time),
                current_time,
            ];

            const display_model = {
                hits: hits_count,
                clicks: clicks,
                fps: frame_times.length,
            };

            Scripting.get_keys(elements).forEach(tag => {
                HtmlBuilder.assign_to_element(elements[tag], {
                    attributes: {
                        innerHTML: `${tag}: ${display_model[tag]}`,
                    },
                });
            });
        });
    }
}



MouseAccuracy.play_game();