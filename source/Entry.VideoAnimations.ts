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
                    left: 0,
                    top: 0,
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
        const armor_binds = {
            texture: await ShaderBuilder.load_texture(gl, "./images/swordly_armor.png"),
        } as const;

        const image_vert_source = `void main(void) {
            gl_Position = vec4((texture_coords * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0); 
            uv = texture_coords;
        }`;
        const screen_vert_source = `void main(void) {
            gl_Position = vec4((texture_coords * 2.0 - 1.0), 0.0, 1.0); 
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
        const armor_material = ShaderBuilder.generate_material(gl, {
            globals: constant_globals,
            vert_source: image_vert_source,
            frag_source: `
            void main(void) {
                lowp vec4 tex_color = texture2D(texture, uv);
                gl_FragColor = tex_color;
            }`,
        });
        const frame_buffer_material = ShaderBuilder.generate_material(gl, {
            globals: constant_globals,
            vert_source: screen_vert_source,
            frag_source: `
            void main(void) {
                lowp vec4 tex_color = texture2D(texture, uv);
                gl_FragColor = tex_color;
            }`,
        });
        const flame_material = ShaderBuilder.generate_material(gl, {
            globals: {
                ...constant_globals,
                ripple: { type: "uniform", unit: "sampler2D", count: 1 },
            },
            vert_source: image_vert_source,
            frag_source: `void main(void) {
                lowp vec2 ripple_uv = uv + vec2(0.0, texture2D(ripple, uv * vec2(16.0, 16.0) - vec2(scroll, 0.0)).r * 0.01);
                lowp vec4 tex_color = texture2D(texture, ripple_uv);
                gl_FragColor = vec4(tex_color.rgb, 1);
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

        document.body.addEventListener("mousemove", (e) => {
            model.state = {
                ...model.state,
                mouse_position: [e.clientX, e.clientY],
            };
        })

        document.body.addEventListener("mousedown", (e) => {
            const canvas_position = Vec2.mul(
                Vec2.div(
                    [e.clientX, e.clientY],
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
        }, 1000 / 60);

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
            y_values: [0, 1, 1, 1, .25, .25, 0],
        }

        const target_diameter = (state: typeof model.state, target: Target) => {
            const time = (state.simulation_tick - target.time) / 4;
            return 64 * SmoothCurve.sample(smooth_curve, time);
        }

        const render = (state: typeof model.state) => {

            // const target_texture = {
            //     texture: gl.createTexture()!,
            //     width: canvas.width,
            //     height: canvas.height };

            // {
            //     // define size and format of level 0
            //     var level = 0;
            //     const internalFormat = gl.RGBA;
            //     const border = 0;
            //     const format = gl.RGBA;
            //     const type = gl.UNSIGNED_BYTE;
            //     const data = null;
            //     gl.bindTexture(gl.TEXTURE_2D, target_texture.texture);
            //     gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
            //         target_texture.width, target_texture.height, border,
            //         format, type, data);

            //     // set the filtering so we don't need mips
            //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            // }

            // {
            //     var framebuffer = gl.createFramebuffer();
            //     const attachmentPoint = gl.COLOR_ATTACHMENT0;
            //     gl.bindTexture(gl.TEXTURE_2D, target_texture.texture);
            //     gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
            //     gl.framebufferTexture2D(gl.FRAMEBUFFER, attachmentPoint, gl.TEXTURE_2D, target_texture.texture, level);
            //     gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            // }

            // gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

            gl.clearColor(0, 0, 0, 1);
            gl.disable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.BLEND)
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            // gl.viewport(
            //     (320 - flame_binds.texture.width) * .5,
            //     (224 - flame_binds.texture.height) * .5,
            //     flame_binds.texture.width,
            //     flame_binds.texture.height);
            // ShaderBuilder.render_material(gl, flame_material, {
            //     ...constant_binds,
            //     ...flame_binds,
            //     scroll: -state.simulation_tick,
            // });
            // gl.viewport(
            //     (320 - beam_binds.texture.width) * .5,
            //     (224 - beam_binds.texture.height) * .5,
            //     beam_binds.texture.width,
            //     beam_binds.texture.height);
            // ShaderBuilder.render_material(gl, material, {
            //     ...constant_binds,
            //     ...beam_binds,
            //     scroll: -state.simulation_tick * 0.2,
            // });

            state.targets.map(target => {
                const scale = target_diameter(state, target);
                gl.viewport(
                    scale * -0.5 + target.position[0],
                    scale * -0.5 + canvas.height - 1 - target.position[1],
                    scale,
                    scale);
                ShaderBuilder.render_material(gl, material, {
                    ...constant_binds,
                    scroll: -(state.simulation_tick - target.time) * 1.619,
                });
            });

            const width = armor_binds.texture.width;
            const height = armor_binds.texture.height;
            gl.viewport(
                width * -.5 + state.mouse_position[0] / canvas.clientWidth * canvas.width,
                height * -.5 + canvas.height - 1 - (state.mouse_position[1] / canvas.clientHeight * canvas.height),
                width,
                height);
            ShaderBuilder.render_material(gl, armor_material, {
                ...constant_binds,
                ...armor_binds,
                scroll: 0,
            });

            // gl.bindFramebuffer(gl.FRAMEBUFFER, null);
            // gl.viewport(
            //     0,
            //     0,
            //     canvas.width,
            //     canvas.height);
            // ShaderBuilder.render_material(gl, frame_buffer_material, {
            //     ...constant_binds,
            //     ...armor_binds,
            //     texture: target_texture,
            //     scroll: -current_time,
            // });
            gl.flush();
        }

        let frame_times: readonly number[] = [];
        // let previous_animation_state = model.state;
        model.listen("all-members", state => {
            // if (previous_animation_state == model.state)
            //     return;
            // previous_animation_state = model.state;

            render(state);

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