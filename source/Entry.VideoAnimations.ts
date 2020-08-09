import { HtmlBuilder } from "./Util.HtmlBuilder";
import { ShaderBuilder } from "./Util.ShaderBuilder";

export namespace VideoAnimations {

    export function generate_platform() {
        const platform = HtmlBuilder.create_children(document.body, {
            canvas: {
                type: "canvas",
                attributes: {
                    width: 320,
                    height: 224,
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
            premultipliedAlpha: false,
        })!;

        const globals = {
            vertices: { type: "element" },
            texture_coords: { type: "attribute", unit: "vec2" },
            camera_size: { type: "uniform", unit: "vec2", count: 1 },
            texture: { type: "uniform", unit: "sampler2D", count: 1 },
            scroll: { type: "uniform", unit: "float", count: 1 },
            uv: { type: "varying", unit: "vec2" },
        } as const;
        const bind_2 = {
            texture: await ShaderBuilder.load_texture(gl, "./images/swordly_fire.png"),
            ripple: await ShaderBuilder.load_texture(gl, "./images/ripple.png"),
        };
        const material_3 = ShaderBuilder.generate_material(gl, {
            globals,
            vert_source: `void main(void) {
                gl_Position = vec4((texture_coords * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0); 
                uv = texture_coords;
            }`,
            frag_source: `
            void main(void) {
                lowp vec4 tex_color = texture2D(texture, uv);
                gl_FragColor = tex_color;
            }`,
        });
        const material_2 = ShaderBuilder.generate_material(gl, {
            globals: {
                ...globals,
                ripple: { type: "uniform", unit: "sampler2D", count: 1 },
            },
            vert_source: `void main(void) {
                gl_Position = vec4((texture_coords * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0); 
                uv = texture_coords;
            }`,
            frag_source: `
            void main(void) {
                lowp vec2 ripple_uv = uv + vec2(0.0, texture2D(ripple, uv * vec2(16.0, 16.0) - vec2(scroll, 0.0)).r * 0.01);
                lowp vec4 tex_color = texture2D(texture, ripple_uv);
                gl_FragColor = vec4(tex_color.rgb, 1);
            }`,
        });

        const thinger_3 = {
            texture: await ShaderBuilder.load_texture(gl, "./images/swordly_beam.png"),
            pattern: await ShaderBuilder.load_texture(gl, "./images/fire pattern 3.png"),
        }
        const thinger_4 = {
            texture: await ShaderBuilder.load_texture(gl, "./images/swordly_armor.png"),
        }
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
        const material = ShaderBuilder.generate_material(gl, {
            globals: {
                ...globals,
                pattern: { type: "uniform", unit: "sampler2D", count: 1 },
            },
            vert_source: `void main(void) {
                gl_Position = vec4((texture_coords * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0); 
                uv = texture_coords;
            }`,
            frag_source: `

            lowp float hue_to_uv() {
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

        const start_time = Date.now() / 1000;
        const animation = () => {
            const current_time = Date.now() / 1000 - start_time;
            gl.clearColor(0, 0, 0, 1);
            gl.disable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.enable(gl.BLEND)
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.viewport(
                (320 - bind_2.texture.width) * .5,
                (224 - bind_2.texture.height) * .5,
                bind_2.texture.width,
                bind_2.texture.height);
            ShaderBuilder.render_material(gl, material_2, {
                ...constant_binds,
                ...bind_2,
                scroll: -current_time,
            });
            [0, 1, 2, 3].map(index => {
                gl.viewport(
                    141 + Math.cos(current_time * 6 + index * 3.14159 * .5 + 3.14159 / 4.0) * 80,
                    110 + Math.sin(current_time * 8 + index  * 3.14159 * .5) * 40,
                    32,
                    32);
                ShaderBuilder.render_material(gl, material, {
                    ...constant_binds,
                    scroll: -current_time,
                });
            });
            gl.viewport(
                (320 - thinger_3.texture.width) * .5,
                (224 - thinger_3.texture.height) * .5,
                thinger_3.texture.width,
                thinger_3.texture.height);
            ShaderBuilder.render_material(gl, material, {
                ...constant_binds,
                ...thinger_3,
                scroll: -current_time,
            });
            gl.viewport(
                (320 - thinger_4.texture.width) * .5,
                (224 - thinger_4.texture.height) * .5,
                thinger_4.texture.width,
                thinger_4.texture.height);
            ShaderBuilder.render_material(gl, material_3, {
                ...constant_binds,
                ...thinger_4,
                scroll: -current_time,
            });
            requestAnimationFrame(animation);
        }
        animation();
    }
}



VideoAnimations.bouncing();