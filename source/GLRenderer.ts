import { GLTexture } from "./GLTexture";
import { Scripting } from "./Util.Scripting";
import { Shaders, Const, Float, Varying, Attribute, Uniform, Vec2, GLSLType, typeToStride, ShaderGlobals } from "./Util.Shaders";

export namespace GLRenderer {
    export async function start(canvas: HTMLCanvasElement) {
        {
            const gl = canvas.getContext('webgl2');
            if (gl == null) {
                return new Error("Canvas rendering context is invalid");
            }

            const glProgram = Shaders.generateShader(gl, {
                textures: {
                    "grass": await GLTexture.load(gl, "./images/grass.jpg"),
                },
                buffers: {
                    "world_position": GLTexture.createBuffer(gl, new Float32Array([
                        0, 1, 1,
                        0, 0, 1,
                        1, 0, 1,
                        1, 0, 1,
                        1, 1, 1,
                        0, 1, 1,
                    ])),
                    "texture_coord": GLTexture.createBuffer(gl, new Float32Array([
                        0, 1,
                        0, 0,
                        1, 0,
                        1, 0,
                        1, 1,
                        0, 1,
                    ])),
                },
                globals: {
                    "grass": { type: "uniform", data: "sampler2D" },
                    "world_position": { type: "attribute", data: "vec3" },
                    "texture_coord": { type: "attribute", data: "vec2" },

                    "camera_size": {
                        type: "const",
                        x: 6,
                        y: 6 * window.innerWidth / window.innerHeight,
                    },
                    "camera_position": { type: "const", x: 0, y: 0 },
                    "x_vector": { type: "const", x: 1, y: 0.5 },
                    "y_vector": { type: "const", x: 0, y: 1 },
                    "z_vector": { type: "const", x: -1, y: 0.5 },
                    "occlusion_color": { type: "const", x: 0.0, y: 0.0, z: 0.0 },

                    "uv": { type: "varying", data: "vec2" },
                    "color": { type: "varying", data: "vec3" },
                }
            }, `                
                void main(void) {
                    vec2 ortho_position =
                        world_position.x * x_vector +
                        world_position.y * y_vector +
                        world_position.z * z_vector;
                    vec4 final_position = vec4((
                        ortho_position -
                        camera_position
                    ) / camera_size, 0.0, 1.0);
                    gl_Position = final_position;
                    uv = texture_coord.xy;
                    color = mix(occlusion_color, vec3(1.0, 1.0, 1.0), world_position.y);
                }
            `, `
                void main(void) {
                    gl_FragColor = texture2D(grass, uv) * vec4(color, 0.0);
                }    
            `);


            { // 🙏 Set up gl context for rendering
                gl.clearColor(0, 0, 0, 0);
                gl.enable(gl.DEPTH_TEST);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.viewport(0, 0, canvas.width, canvas.height);
            }
    
            // ✏ Draw the buffer
            gl.useProgram(glProgram);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }
}