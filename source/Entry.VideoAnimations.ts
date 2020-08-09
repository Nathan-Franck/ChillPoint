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

        const constant_binds = {
            vertices: ShaderBuilder.create_element_buffer(gl, Uint16Array.from([0, 1, 2, 2, 1, 3])),
            texture_coords: ShaderBuilder.create_buffer(gl, Float32Array.from([
                0, 0,
                1, 0,
                0, 1,
                1, 1,
            ])),
            pattern: await ShaderBuilder.load_texture(gl, "./images/fire pattern.png"),
            texture: await ShaderBuilder.load_texture(gl, "./images/elemental ball 2.png"),
            camera_size: [canvas.width, canvas.height],
        } as const;
        const material = ShaderBuilder.generate_material(gl, {
            globals: {
                vertices: { type: "element" },
                texture_coords: { type: "attribute", unit: "vec2" },
                camera_size: { type: "uniform", unit: "vec2", count: 1 },
                texture: { type: "uniform", unit: "sampler2D", count: 1 },
                pattern: { type: "uniform", unit: "sampler2D", count: 1 },
                scroll: { type: "uniform", unit: "float", count: 1 },
                uv: { type: "varying", unit: "vec2" },
            },
            vert_source: `void main(void) {
                gl_Position = vec4((texture_coords * 2.0 - 1.0) * vec2(1.0, -1.0), 0.0, 1.0); 
                uv = texture_coords;
            }`,
            frag_source: `
            lowp float hue_to_uv() {
                lowp vec4 i = texture2D(texture, uv);
                lowp float a = i.r  - i.b;
                lowp float b = 1.0 - i.r  + i.g;
                lowp float c = i.g  - i.r;
                lowp float d = 1.0 - i.g  + i.b;
                lowp float e = i.b  - i.g;
                lowp float f = 1.0 - i.b  + i.r;
                if (b >= 0.0 && c < 0.0 && a >= 0.0 ) return (a + b) / 6.0;
                if (d >= 0.0 && e < 0.0 && c >= 0.0 ) return (c + d) / 6.0 + 1.0 / 3.0;
                return (e + f) / 6.0 + 2.0 / 3.0;
            }

            void main(void) {
                lowp float tex_uv = hue_to_uv() + scroll * 4.0;
                lowp float cool = tex_uv - floor(tex_uv);
                lowp vec4 pattern_color = texture2D(pattern, vec2(tex_uv * 1.0, 0.5));
                gl_FragColor = vec4(pattern_color.rgb, pattern_color.a * texture2D(texture, uv).a);
            }`,
        });

        const start_time = Date.now() / 1000;
        const animation = () => {
            const current_time = Date.now() / 1000 - start_time;
            gl.clearColor(0, 0, 0, 0);
            gl.enable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.viewport(100 + Math.cos(current_time * 4 + 3.14159 / 2.0) * 80, 70 + Math.sin(current_time * 8) * 40, 64, 64);
            gl.enable(gl.BLEND)
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            ShaderBuilder.render_material(gl, material, {
                ...constant_binds,
                scroll: -current_time,
            });
            requestAnimationFrame(animation);
        }
        animation();
    }
}



VideoAnimations.bouncing();