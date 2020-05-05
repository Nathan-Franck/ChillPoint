import { GLTexture } from "./GLTexture";
import { Shaders, Vec2, Vec3 } from "./Util.Shaders";
import { Vec3Math } from "./VecMath";

export namespace GLRenderer {
    export async function start(canvas: HTMLCanvasElement) {
        {
            const gl = canvas.getContext('webgl2');
            if (gl == null) {
                return new Error("Canvas rendering context is invalid");
            }

            const chunk_width = 32;
            const vertices_width = chunk_width + 1;
            const chunk_size = chunk_width * chunk_width;
            const vertices_size = vertices_width * vertices_width;

            const heights = new Uint8Array(chunk_size);
            for (let i = 0; i < chunk_size; i++) {
                heights[i] = Math.floor(Math.random() * 2);
                //heights[i] = i % 43 == 0 ? 1 : 0;
            }

            const coords_offset_per_square = [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
            ]
            const sun_direction = Vec3Math.normalize({ x: 1, y: -1, z: -1 });

            const vertices = new Float32Array(vertices_size * 6 * 3);
            const color = new Float32Array(vertices_size * 6 * 3);

            for (let height_index = 0; height_index < chunk_size; height_index++) {
                const height_coord = {
                    x: height_index % chunk_width,
                    y: Math.floor(height_index / chunk_width),
                };
                
                const raw_vertices = coords_offset_per_square.map(vec => ({
                    x: vec.x + height_coord.x,
                    y: vec.y + height_coord.y,
                })).map(coord => ({
                    ...coord,
                    z: heights[coord.x + coord.y * chunk_width] * 0.5,
                }));

                const new_vertices = (raw_vertices[0].z != raw_vertices[3].z ? [
                    0, 1, 2, 2, 1, 3,
                ] : [
                    1, 3, 0, 0, 3, 2,
                ]).map(raw_index => raw_vertices[raw_index]);

                const shades = [
                    [new_vertices[0], new_vertices[1], new_vertices[2]],
                    [new_vertices[3], new_vertices[4], new_vertices[5]],
                ].map(verts => {
                    const diff_a = Vec3Math.subtract(verts[1], verts[0]);
                    const diff_b = Vec3Math.subtract(verts[2], verts[0]);
                    const normal = Vec3Math.normalize(Vec3Math.cross(diff_a, diff_b));
                    return Math.max(-Vec3Math.dot(normal, sun_direction), 0) + 0.5;
                });

                vertices.set(
                    new_vertices.map(coord => [coord.x, coord.y, coord.z]).flat(1),
                    height_index * 6 * 3);
                color.set(
                    [
                        shades[0], shades[0], shades[0],
                        shades[0], shades[0], shades[0],
                        shades[0], shades[0], shades[0],
                        shades[1], shades[1], shades[1],
                        shades[1], shades[1], shades[1],
                        shades[1], shades[1], shades[1],
                    ],
                    height_index * 6 * 3);
            }


            const gl_program = Shaders.generate_shader(gl, {
                textures: {
                    "grass": await GLTexture.load(gl, "./images/grass.jpg"),
                },
                buffers: {
                    "world_position": GLTexture.create_buffer(gl, vertices),
                    "vertex_color": GLTexture.create_buffer(gl, color),
                },
                globals: {
                    "grass": { type: "uniform", data: "sampler2D" },
                    "world_position": { type: "attribute", data: "vec3" },
                    "vertex_color": { type: "attribute", data: "vec3" },

                    "camera_size": {
                        type: "const",
                        x: 16 * window.innerWidth / window.innerHeight,
                        y: 16,
                    },
                    "camera_position": { type: "const", x: 0, y: 16 },
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
                    uv = world_position.xy;
                    color = vertex_color * mix(occlusion_color, vec3(1.0, 1.0, 1.0), (world_position.z + 1.0) / 1.0);
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