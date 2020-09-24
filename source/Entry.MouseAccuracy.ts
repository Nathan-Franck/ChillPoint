import { Model } from "./Model";
import { substate_example } from "./SubstateExample";
import { HtmlBuilder } from "./Util.HtmlBuilder";
import { Scripting } from "./Util.Scripting";
import { ShaderBuilder } from "./Util.ShaderBuilder";
import { SmoothCurve } from "./Util.SmoothCurve";
import { Vec2 } from "./Util.VecMath";

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
            antialias: false,
        })!;

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
            pattern: await ShaderBuilder.load_texture(gl, "./images/circle pattern.png"),
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
                    uv = distance * 0.025;
                }`,
            frag_source: `void main(void) {
                gl_FragColor = texture2D(pattern, vec2(uv, 0.5)) * vec4(1.0, 0.2, 0.2, 1.0);
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
                mouse_position: { type: "uniform", unit: "vec2", count: 1 },
                pattern: { type: "uniform", unit: "sampler2D", count: 1 },
            },
            vert_source: image_vert_source,
            frag_source: `void main(void) {
                lowp float tex_uv = length(mouse_position - uv * canvas_dimensions) / 128.0;
                lowp vec4 pattern_color = texture2D(pattern, vec2(sqrt(tex_uv) * 4.0, 0.5));
                lowp float alpha = pattern_color.a / (1.0 + tex_uv * 4.0);
                gl_FragColor = vec4(pattern_color.rgb, alpha);
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

        const model = Model.create({
            simulation_time: 0,
            mouse_position: [0, 0] as Vec2,
            targets: [] as readonly Target[],
            tail: [] as readonly {
                readonly position: Vec2,
                readonly distance: number,
            }[],
            clicks: [] as readonly {
                readonly position: Vec2,
                readonly time: number,
            }[],
            hits: 0,
        });

        canvas.addEventListener("mousemove", (e) => {
            model.state = {
                ...model.state,
                mouse_position: Vec2.mul(
                    [canvas.width, canvas.height],
                    Vec2.div(
                        [e.offsetX, e.offsetY],
                        [canvas.clientWidth, canvas.clientHeight])),
            };
        })

        canvas.addEventListener("mousedown", (e) => {
            const { state } = model;
            const canvas_position = Vec2.mul(
                Vec2.div(
                    [e.offsetX, e.offsetY],
                    [canvas.clientWidth, canvas.clientHeight]),
                [canvas.width, canvas.height]);
            const hit_target = state.targets.find(target =>
                target.despawn == null &&
                Vec2.dist(target.position, canvas_position) < target_diameter(
                    state.simulation_time - target.spawn_time, target) * 0.5);
            const clicks: typeof state.clicks = [...state.clicks, {
                position: canvas_position,
                time: state.simulation_time,
            }];
            if (hit_target != null) {
                // ✅ Clear target clicked
                model.state = {
                    ...state,
                    clicks,
                    hits: state.hits + 1,
                    targets: state.targets.map(target =>
                        target != hit_target ? target :
                            <Target>{
                                ...target,
                                despawn: {
                                    time: state.simulation_time,
                                    cause: "hit",
                                }
                            }),
                };
            } else {
                // 🛑 Punish player for mis-click
                const punished = state.targets.reduce<{
                    target: Target,
                    distance: number,
                } | undefined>((closest, target) => {
                    if (target.despawn != null)
                        return closest;
                    const distance = Vec2.dist(target.position, canvas_position);
                    if (closest == null ||
                        closest.distance > distance)
                        return {
                            target,
                            distance,
                        };
                    return closest;
                }, undefined);

                model.state = {
                    ...state,
                    clicks,
                    targets: state.targets.map(target =>
                        target != punished?.target ? target :
                            <Target>{
                                ...target,
                                despawn: {
                                    time: state.simulation_time,
                                    cause: "punish",
                                },
                            }),
                };
            }
        })

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

        const get_time = () => Date.now() / 1000;

        setInterval(() => {
            model.state = {
                ...model.state,
                simulation_time: get_time(),
            };
        }, 1000 / 144);

        setInterval(() => {
            model.state = {
                ...model.state,
                targets: [
                    ...model.state.targets,
                    {
                        position: [Math.random() * canvas.width, Math.random() * canvas.height],
                        spawn_time: get_time(),
                    },
                ],
            };
        }, 1000 / 2);

        const diameter_curve: SmoothCurve = {
            x_range: [0, 4],
            y_values: [0, 1, 1, 1, .5, .5, 0],
        }

        const despawn_fade_curve: SmoothCurve = {
            x_range: [0, 2],
            y_values: [1, .2, .1, 0],
        }

        const target_diameter = (time: number, target: Target) => {
            return 64 * SmoothCurve.sample(diameter_curve, time);
        }

        let frame_times: readonly number[] = [];
        // let last_state = model.state;
        // const render = () => {

        //     const { state } = model;

        //     // if (last_state == state)
        //     //     return;

        //     last_state = state;

        const append_mouse_to_tail = (state: typeof model.state, min_offset_for_grow: number) => {
            const last_first = state.tail[0];
            const { mouse_position } = state;
            const distance_offset = last_first == null ? 10000 : Vec2.dist(mouse_position, last_first.position);
            const max_length = 1000;
            if (distance_offset < min_offset_for_grow) {
                return { tail: state.tail };
            }
            return {
                tail: [
                    {
                        position: mouse_position,
                        distance: 0,
                    },
                    ...state.tail.map(particle => ({
                        ...particle,
                        distance: particle.distance + distance_offset,
                    })).filter(particle => particle.distance <= max_length),
                ],
            };
        }

        model.respond("mouse_position", state => append_mouse_to_tail(state, 32));

        model.listen("all-members", state => {

            gl.clearColor(.2, .2, .2, 1);
            gl.disable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.BLEND)
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

            const canvas_dimensions = [canvas.width, canvas.height] as const;

            // 🎯 Targets
            state.targets.map(target => {
                if (target.despawn != null)
                    return;
                const scale = target_diameter(state.simulation_time - target.spawn_time, target);
                gl.viewport(
                    scale * -0.5 + target.position[0],
                    scale * -0.5 + canvas.height - 1 - target.position[1],
                    scale,
                    scale);
                ShaderBuilder.render_material(gl, material, {
                    ...constant_binds,
                    canvas_dimensions,
                    blend_color: [1, 1, 1, 1],
                    scroll: -(state.simulation_time - target.spawn_time) * 1.619 * .2,
                });
            });

            // ☁ Despawned targets
            state.targets.map(target => {
                if (target.despawn == null)
                    return;
                const scale = target_diameter(target.despawn.time - target.spawn_time, target);
                const time = state.simulation_time - target.despawn.time;
                gl.viewport(
                    scale * -0.5 + target.position[0],
                    scale * -0.5 + canvas.height - 1 - target.position[1],
                    scale,
                    scale);
                const color = target.despawn.cause == "punish" ?
                    [1, 0, 0] as const :
                    [0, 1, 0] as const;
                ShaderBuilder.render_material(gl, material, {
                    ...constant_binds,
                    canvas_dimensions,
                    blend_color: [...color, SmoothCurve.sample(despawn_fade_curve, time)],
                    scroll: -(state.simulation_time - target.spawn_time) * 1.619 * .2,
                });
            });

            // ⭕ Circle background
            gl.viewport(
                0, 0,
                canvas.width,
                canvas.height);
            ShaderBuilder.render_material(gl, background_material, {
                ...constant_binds,
                ...background_binds,
                canvas_dimensions,
                mouse_position: state.mouse_position,
            });

            substate_example();

            // 🐒 Tail
            gl.viewport(
                0, 0,
                canvas.width,
                canvas.height);
            const { tail } = append_mouse_to_tail(state, 0);
            const thickery = 2;
            const positions = new Float32Array(tail.length * 4);
            positions.set(tail.
                flatMap(({ position }, index) => {
                    const next_position = index < tail.length - 1 ?
                        tail[index + 1].position :
                        Vec2.add(
                            position,
                            Vec2.sub(
                                position,
                                tail[index - 1].position));
                    const diff = Vec2.sub(next_position, position);
                    const perp = Vec2.scale(
                        Vec2.normal([diff[1], -diff[0]]),
                        thickery);
                    return [
                        ...Vec2.add(position, perp),
                        ...Vec2.sub(position, perp)];
                }));
            const distances = new Float32Array(tail.length * 2);
            distances.set(tail.flatMap(({ distance }) => [distance, distance]));
            ShaderBuilder.render_material(gl, tail_material, {
                ...tail_binds,
                distance: ShaderBuilder.create_buffer(gl, distances),
                position: ShaderBuilder.create_buffer(gl, positions),
            });

            // 👆 Rendered pointer
            const width = cursor_binds.texture.width;
            const height = cursor_binds.texture.height;
            gl.viewport(
                state.mouse_position[0],
                -height + canvas.height - 1 - state.mouse_position[1],
                width,
                height);
            ShaderBuilder.render_material(gl, cursor_material, {
                ...constant_binds,
                ...cursor_binds,
                canvas_dimensions,
            });

            gl.flush();

            const current_time = get_time();

            frame_times = [
                ...frame_times.filter(frame_time =>
                    frame_time + 1 >= current_time),
                current_time,
            ];

            const display_state = {
                ...state,
                clicks: state.clicks.length,
                fps: frame_times.length,
            };

            Scripting.get_keys(elements).forEach(tag => {
                HtmlBuilder.assign_to_element(elements[tag], {
                    attributes: {
                        innerHTML: `${tag}: ${display_state[tag]}`,
                    },
                });
            });
        });
    }
}



MouseAccuracy.play_game();