import { Model } from "./Model";
import { HtmlBuilder } from "./Util.HtmlBuilder";
import { Scripting } from "./Util.Scripting";
import { ShaderBuilder } from "./Util.ShaderBuilder";
import { SmoothCurve } from "./Util.SmoothCurve";
import { Vec2 } from "./Util.VecMath";

export namespace VideoAnimations {

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
        const resize_canvas = () => {
            const { canvas } = platform;
            const t = [window.innerWidth / canvas.width, window.innerHeight / canvas.height];
            const min_t = Math.min(...t);
            HtmlBuilder.assign_to_element(canvas, {
                style: {
                    width: canvas.width * min_t,
                    height: canvas.height * min_t,
                    left: (window.innerWidth - canvas.width * min_t) * .5,
                    top: (window.innerHeight - canvas.height * min_t) * .5,
                    cursor: "none",
                }
            });
        };
        window.onresize = resize_canvas;
        resize_canvas();

        return platform;
    }

    export async function bouncing() {
        const { canvas } = generate_platform();
        const gl = canvas.getContext("webgl2", {
            desynchronized: false,
            preserveDrawingBuffer: true,
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
            camera_size: [canvas.width, canvas.height],
        } as const;
        const flame_binds = {
            texture: await ShaderBuilder.load_texture(gl, "./images/swordly_fire.png"),
            ripple: await ShaderBuilder.load_texture(gl, "./images/ripple.png"),
        };
        const beam_binds = {
            texture: await ShaderBuilder.load_texture(gl, "./images/swordly_beam.png"),
            pattern: await ShaderBuilder.load_texture(gl, "./images/fire pattern 3.png"),
        } as const;
        const cursor_binds = {
            texture: await ShaderBuilder.load_texture(gl, "./images/cursor.png"),
        } as const;

        const image_vert_source = `void main(void) {
            gl_Position = vec4((texture_coords * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0); 
            uv = texture_coords;
        }`;
        const constant_globals = {
            vertices: { type: "element" },
            texture_coords: { type: "attribute", unit: "vec2" },
            camera_size: { type: "uniform", unit: "vec2", count: 1 },
            texture: { type: "uniform", unit: "sampler2D", count: 1 },
            scroll: { type: "uniform", unit: "float", count: 1 },
            uv: { type: "varying", unit: "vec2" },
        } as const;
        const material = ShaderBuilder.generate_material(gl, {
            globals: {
                ...constant_globals,
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
                gl_FragColor = vec4(pattern_color.rgb / alpha, alpha);
            }`,
        });
        const cursor_material = ShaderBuilder.generate_material(gl, {
            globals: constant_globals,
            vert_source: image_vert_source,
            frag_source: `
            void main(void) {
                lowp vec4 tex_color = texture2D(texture, uv);
                gl_FragColor = tex_color;
            }`,
        });

        type Target = {
            position: Vec2,
            time: number,
        };

        const model = Model.create({
            simulation_tick: 0,
            mouse_position: [0, 0] as Vec2,
            targets: [] as readonly Target[],
            clicks: 0,
            hits: 0,
        });

        canvas.addEventListener("mousemove", (e) => {
            model.state = {
                ...model.state,
                mouse_position: [e.offsetX, e.offsetY],
            };
        })

        canvas.addEventListener("mousedown", (e) => {
            const canvas_position = Vec2.mul(
                Vec2.div(
                    [e.offsetX, e.offsetY],
                    [canvas.clientWidth, canvas.clientHeight]),
                [canvas.width, canvas.height]);

            console.log(canvas_position);
            const hit_target = model.state.targets.find(target =>
                Vec2.dist(target.position, canvas_position) < target_diameter(model.state, target) * 0.5);
            if (hit_target != null) {
                model.state = {
                    ...model.state,
                    hits: model.state.hits + 1,
                    clicks: model.state.clicks + 1,
                    targets: model.state.targets.filter(target =>
                        target != hit_target),
                };
            } else {
                model.state = {
                    ...model.state,
                    clicks: model.state.clicks + 1,
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
                simulation_tick: get_time(),
            };
        }, 1000 / 144);

        setInterval(() => {
            model.state = {
                ...model.state,
                targets: [
                    ...model.state.targets,
                    {
                        position: [Math.random() * canvas.width, Math.random() * canvas.height],
                        time: get_time(),
                    },
                ],
            };
        }, 1000 / 2);

        const smooth_curve: SmoothCurve = {
            x_range: [0, 1],
            y_values: [0, 1, 1, 1, .5, .5, 0],
        }

        const target_diameter = (state: typeof model.state, target: Target) => {
            const time = (state.simulation_tick - target.time) / 4;
            return 64 * SmoothCurve.sample(smooth_curve, time);
        }

        let frame_times: readonly number[] = [];
        model.listen("all-members", state => {

            gl.clearColor(.2, .2, .2, 1);
            gl.disable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.BLEND)
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            state.targets.map(target => {
                const scale = target_diameter(state, target);
                gl.viewport(
                    scale * -0.5 + target.position[0],
                    scale * -0.5 + canvas.height - 1 - target.position[1],
                    scale,
                    scale);
                ShaderBuilder.render_material(gl, material, {
                    ...constant_binds,
                    scroll: -(state.simulation_tick - target.time) * 1.619 * .2,
                });
            });

            const width = cursor_binds.texture.width;
            const height = cursor_binds.texture.height;
            gl.viewport(
                Math.round(state.mouse_position[0] / canvas.clientWidth * canvas.width),
                -height + Math.round(canvas.height - 1 - (state.mouse_position[1] / canvas.clientHeight * canvas.height)),
                width,
                height);
            ShaderBuilder.render_material(gl, cursor_material, {
                ...constant_binds,
                ...cursor_binds,
                scroll: 0,
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
                fps: frame_times.length,
            };

            Scripting.get_keys(elements).forEach(tag => {
                HtmlBuilder.assign_to_element(elements[tag], {
                    attributes: {
                        innerHTML: `${tag}: ${display_state[tag]}`,
                    },
                });
            })
        });
    }
}



VideoAnimations.bouncing();