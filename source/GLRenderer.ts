import { GLTexture } from "./GLTexture";

export namespace GLRenderer {
    export async function start(canvas: HTMLCanvasElement) {
        {
            const gl = canvas.getContext('webgl2');
            if (gl == null) {
                return new Error("Canvas rendering context is invalid");
            }

            // ✨🎨 Create fragment shader object
            const shaderProgram = gl.createProgram();
            {
                const vertShader = gl.createShader(gl.VERTEX_SHADER);
                const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
                if (vertShader == null ||
                    fragShader == null ||
                    shaderProgram == null) {
                    return new Error("Vertex/Fragment shader not properly initialized");
                }

                type Prop = [
                    "const" | "attribute" | "varying",
                    number | { x: number, y: number },
                ]
                type PropKey = "camera_size" | "camera_position" | "x_vector" | "y_vector" | "z_vector";

                const props: { [key in PropKey]: Prop } = {
                    camera_size: ["const", { x: 15, y: 15 * window.innerWidth / window.innerHeight }],
                    camera_position: ["const", { x: 0, y: 0 }],
                    x_vector: ["const", { x: 1, y: 0.5 }],
                    y_vector: ["const", { x: 0, y: 1 }],
                    z_vector: ["const", { x: -1, y: 0.5 }],
                };
                const propText = (Object.keys(props) as PropKey[]).reduce((text, key) => {
                    const [type, value] = props[key];
                    return `${text}\n${type} ${
                        typeof value == "number" ?
                            "float" :
                            "vec2"
                    } ${key} = ${
                        typeof value == "number" ?
                            value.toFixed(2) :
                            `vec2(${value.x}, ${value.y})`
                        };`
                }, "");

                gl.shaderSource(vertShader, `
                    attribute vec3 position;
                    varying highp vec2 texture_coord;
                    ${propText}

                    void main(void) {
                        vec2 ortho_position = position.x * x_vector + position.y * y_vector + position.z * z_vector;
                        vec4 final_position = vec4((
                            ortho_position -
                            camera_position
                        ) / camera_size, 0.0, 1.0);
                        gl_Position = final_position;
                        texture_coord = position.xy;
                    }
                `);

                gl.shaderSource(fragShader, `
                    varying highp vec2 texture_coord;
                    uniform sampler2D  texture_sampler;
                    void main(void) {
                        gl_FragColor = texture2D(texture_sampler, texture_coord);
                    }
                `);

                [vertShader, fragShader].forEach(shader => {
                    gl.compileShader(shader);
                    gl.attachShader(shaderProgram, shader);
                    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                        console.error(gl.getShaderInfoLog(shader));
                    }
                });

                gl.linkProgram(shaderProgram);
            }

            { // 🦗 Texture to display
                gl.activeTexture(gl.TEXTURE0);
                gl.bindTexture(gl.TEXTURE_2D, await GLTexture.load(gl, "./images/grass.jpg"));
                gl.uniform1i(gl.getUniformLocation(shaderProgram, "texture_sampler"), 0);
            }

            { // 👇 Set the points of the triangle to a buffer, assign to shader attribute
                var vertex_buffer = gl.createBuffer();
                gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                    -1, 1, 1,
                    -1, -1, 1,
                    1, -1, 1,
                    1, -1, 1,
                    1, 1, 1,
                    -1, 1, 1,
                ]), gl.STATIC_DRAW);
                var position = gl.getAttribLocation(shaderProgram, "position");
                gl.vertexAttribPointer(position, 3, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(position);
            }

            { // 🙏 Set up gl context for rendering
                gl.clearColor(0, 0, 0, 0);
                gl.enable(gl.DEPTH_TEST);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.viewport(0, 0, canvas.width, canvas.height);
            }

            // ✏ Draw the buffer
            gl.useProgram(shaderProgram);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
    }
}