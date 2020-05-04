export namespace GLRenderer {
    export function start(canvas: HTMLCanvasElement) {
        {
            var gl = canvas.getContext('webgl2');
            if (gl == null) {
                return new Error("Canvas rendering context is invalid");
            }
            
            // ✨🎨 Create fragment shader object
            var shaderProgram = gl.createProgram();
            {
                var vertShader = gl.createShader(gl.VERTEX_SHADER);
                var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
                if (vertShader == null ||
                    fragShader == null ||
                    shaderProgram == null) {
                        return new Error("Vertex/Fragment shader not properly initialized");
                }
                gl.shaderSource(vertShader, `
                    attribute vec3 position;
                    const float camera_size = 30;
                    const vec2 camera_position = vec2(0.0, 0.0);
                    const vec2 x_vector = vec2(1.0, 0.5);
                    const vec2 y_vector = vec2(0, 1.0);
                    const vec2 z_vector = vec2(-1.0, 0.5);
                    void main(void) {
                        vec2 ortho_position = position.x * x_vector + position.y * y_vector + position.z * z_vector;
                        gl_Position = vec4((
                            ortho_position -
                            camera_position +
                            vec2(camera_size, camera_size) * 0.5
                        ) / camera_size, 0.0, 1.0);
                    }`);
                gl.shaderSource(fragShader, `
                    void main(void) {
                        gl_FragColor = vec4(0.0, 1, 0.0, 1);
                    }`);
                gl.compileShader(vertShader);
                gl.compileShader(fragShader);
                gl.attachShader(shaderProgram, vertShader);
                gl.attachShader(shaderProgram, fragShader);
                gl.linkProgram(shaderProgram);
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