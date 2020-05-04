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

            const environment = Shaders.validateEnvironment({
                textures: {
                    texture_sampler: await GLTexture.load(gl, "./images/grass.jpg"),
                },
                buffers: {
                    position: GLTexture.createBuffer(gl, new Float32Array([
                        -1, 1, 1,
                        -1, -1, 1,
                        1, -1, 1,
                        1, -1, 1,
                        1, 1, 1,
                        -1, 1, 1,
                    ])),
                },
                globals: {
                    camera_size: {
                        type: "const",
                        x: 15,
                        y: 15 * window.innerWidth / window.innerHeight,
                    },
                    camera_position: { type: "const", x: 0, y: 0 },
                    x_vector: { type: "const", x: 1, y: 0.5 },
                    y_vector: { type: "const", x: 0, y: 1 },
                    z_vector: { type: "const", x: -1, y: 0.5 },
                    position: { type: "attribute", data: "vec3" },
                    texture_coord: { type: "varying", data: "vec2" },
                    texture_sampler: { type: "uniform", data: "sampler2D" },
                }
            });

            const vertSource = `
                ${Shaders.toVertText(environment.globals)}
                
                void main(void) {
                    vec2 ortho_position = position.x * x_vector + position.y * y_vector + position.z * z_vector;
                    vec4 final_position = vec4((
                        ortho_position -
                        camera_position
                    ) / camera_size, 0.0, 1.0);
                    gl_Position = final_position;
                    texture_coord = position.xy;
                }
            `;
            const fragSource = `
                ${Shaders.toFragText(environment.globals)}

                void main(void) {
                    gl_FragColor = texture2D(texture_sampler, texture_coord);
                }    
            `;

            // ✨🎨 Create fragment shader object
            const glProgram = gl.createProgram();
            {
                const vertShader = gl.createShader(gl.VERTEX_SHADER);
                const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
                if (vertShader == null ||
                    fragShader == null ||
                    glProgram == null) {
                    return new Error("Vertex/Fragment shader not properly initialized");
                }

                gl.shaderSource(vertShader, vertSource);
                gl.shaderSource(fragShader, fragSource);

                [vertShader, fragShader].forEach(shader => {
                    gl.compileShader(shader);
                    gl.attachShader(glProgram, shader);
                    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                        console.error(gl.getShaderInfoLog(shader));
                    }
                });

                gl.linkProgram(glProgram);
            }

            { // 🦗 Texture to display
                Scripting.getKeys(environment.textures).forEach((key, index) => {
                    gl.activeTexture(gl.TEXTURE0 + index);
                    gl.bindTexture(gl.TEXTURE_2D, environment.textures[key]);

                    const uniformLocation = gl.getUniformLocation(glProgram, key);
                    gl.uniform1i(uniformLocation, index);
                });
            }

            { // 👇 Set the points of the triangle to a buffer, assign to shader attribute
                Scripting.getKeys(environment.buffers).forEach(key => {
                    gl.bindBuffer(gl.ARRAY_BUFFER, environment.buffers[key]);
                    const attributeLocation = gl.getAttribLocation(glProgram, key);
                    const dataType = environment.globals[key].data;
                    gl.vertexAttribPointer(attributeLocation, typeToStride[dataType], gl.FLOAT, false, 0, 0);
                    gl.enableVertexAttribArray(attributeLocation);
                });
            }

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