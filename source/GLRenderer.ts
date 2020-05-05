import { GLTexture } from "./GLTexture";
import { Shaders, Vec2 } from "./Util.Shaders";

export namespace GLRenderer {
    export async function start(canvas: HTMLCanvasElement) {
        {
            const gl = canvas.getContext('webgl2');
            if (gl == null) {
                return new Error("Canvas rendering context is invalid");
            }

            const chunk_width = 64;
            const vertices_width = chunk_width + 1;
            const chunk_size = chunk_width * chunk_width;
            const vertices_size = vertices_width * vertices_width;

            const heights = new Uint8Array(chunk_size);
            for (let i = 0; i < chunk_size; i++) {
                heights[i] = Math.floor(Math.random() * 2);
            }

            const square_positions: Vec2[] = [
                { x: 1, y: 1 },
                { x: 0, y: 1 },
                { x: 0, y: 0 },
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
            ];
            const square_texture_coords = [
                0, 1,
                0, 0,
                1, 0,
                1, 0,
                1, 1,
                0, 1,
            ];

            const vertices = new Float32Array(vertices_size * square_positions.length * 3);
            const texture_coords = new Float32Array(vertices_size * square_texture_coords.length);

            for (let height_index = 0; height_index < chunk_size; height_index++) {
                const height_coord = {
                    x: height_index % chunk_width,
                    y: Math.floor(height_index / chunk_width),
                };
                vertices.set(
                    square_positions.map(vec => ({
                        x: vec.x + height_coord.x,
                        y: vec.y + height_coord.y,
                    })).map(coord => [
                        coord.x,
                        coord.y,
                        heights[coord.x + coord.y * chunk_width],
                    ]).flat(1),
                    height_index * square_positions.length * 3);
                texture_coords.set(
                    square_texture_coords,
                    height_index * square_texture_coords.length);
            }


            const gl_program = Shaders.generate_shader(gl, {
                textures: {
                    "grass": await GLTexture.load(gl, "./images/grass.jpg"),
                },
                buffers: {
                    "world_position": GLTexture.create_buffer(gl, vertices),
                    "texture_coord": GLTexture.create_buffer(gl, texture_coords),
                },
                globals: {
                    "grass": { type: "uniform", data: "sampler2D" },
                    "world_position": { type: "attribute", data: "vec3" },
                    "texture_coord": { type: "attribute", data: "vec2" },

                    "camera_size": {
                        type: "const",
                        x: 24 * window.innerWidth / window.innerHeight,
                        y: 24,
                    },
                    "camera_position": { type: "const", x: 0, y: 32 },
                    "x_vector": { type: "const", x: 1, y: 0.5 },
                    "y_vector": { type: "const", x: -1, y: 0.5 },
                    "z_vector": { type: "const", x: 0, y: 1 },
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
                    color = mix(occlusion_color, vec3(1.0, 1.0, 1.0), (world_position.z + 1.0) / 2.0);
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
            gl.useProgram(gl_program);
            gl.drawArrays(gl.TRIANGLES, 0, vertices.length);
        }
    }
}