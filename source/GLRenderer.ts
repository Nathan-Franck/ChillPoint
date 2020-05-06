import { GLTexture } from "./GLTexture";
import { Shaders, Vec2, Vec3, ShaderGlobals, Const } from "./Util.Shaders";
import { Vec3Math, VecMath } from "./VecMath";

export namespace GLRenderer {
    export async function start(canvas: HTMLCanvasElement) {
        {
            const gl = canvas.getContext('webgl2');
            if (gl == null) {
                return new Error("Canvas rendering context is invalid");
            }

            const chunk_width = 32;
            const heights_width = chunk_width + 1;
            const chunk_size = chunk_width * chunk_width;
            const heights_size = heights_width * heights_width;

            let heights = new Array(heights_size);
            for (let i = 0; i < heights_size; i++) {
                heights[i] = Math.floor(Math.pow(Math.random(), 4) * 5);
                //heights[i] = i % 43 == 0 ? 2 : 0;
            }
            // 🌊 Erosion
            const erosion_samples = [
                { x: -1, y: -1 },
                { x: 0, y: -1 },
                { x: 1, y: -1 },
                { x: -1, y: 0 },
                { x: 1, y: 0 },
                { x: -1, y: 1 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
            ];
            for (let i = 0; i < 4; i++) {
                heights = heights.map((height, height_index) => ({
                    height,
                    x: height_index % heights_width,
                    y: Math.floor(height_index / heights_width),
                })).map(height_info => {
                    const other_height = erosion_samples.reduce<number>((height, sample) => {
                        const height_index = VecMath.to_index_bounded(
                            VecMath.add(sample, height_info),
                            heights_width)
                        if (height_index == null) {
                            return height;
                        }
                        return Math.max(height, heights[height_index]);
                    }, 0);
                    return height_info.height + Math.min(Math.max(other_height - height_info.height - 1, 0), 1);
                });
            }
            heights = heights.map(height => Math.min(height, 3));

            const coords_offset_per_square = [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
            ]
            const sun_direction = Vec3Math.normalize({ x: 1, y: -1, z: -2 });

            const vertices = new Float32Array(chunk_size * 6 * 3);
            const color = new Float32Array(chunk_size * 6 * 3);

            for (let height_index = 0; height_index < chunk_size; height_index++) {
                const height_coord = {
                    x: height_index % heights_width,
                    y: Math.floor(height_index / heights_width),
                };

                const raw_vertices = coords_offset_per_square.map(vec => ({
                    x: vec.x + height_coord.x,
                    y: vec.y + height_coord.y,
                })).map(coord => ({
                    ...coord,
                    z: heights[VecMath.to_index(coord, heights_width)] * 0.5,
                }));

                const new_vertices = (raw_vertices[0].z != raw_vertices[3].z ?
                    [0, 1, 2, 2, 1, 3] :
                    [1, 3, 0, 0, 3, 2]
                ).map(raw_index => raw_vertices[raw_index]);

                const shades = [
                    [new_vertices[0], new_vertices[1], new_vertices[2]],
                    [new_vertices[3], new_vertices[4], new_vertices[5]],
                ].map(verts => {
                    const diff_a = Vec3Math.subtract(verts[1], verts[0]);
                    const diff_b = Vec3Math.subtract(verts[2], verts[0]);
                    const normal = Vec3Math.normalize(Vec3Math.cross(diff_a, diff_b));
                    return Math.max(-Vec3Math.dot(normal, sun_direction), 0) + 0.1;
                });

                vertices.set(
                    new_vertices.map(coord => [coord.x, coord.y, coord.z]).flat(1),
                    height_index * 6 * 3);
                color.set([
                        shades[0], shades[0], shades[0],
                        shades[0], shades[0], shades[0],
                        shades[0], shades[0], shades[0],
                        shades[1], shades[1], shades[1],
                        shades[1], shades[1], shades[1],
                        shades[1], shades[1], shades[1],
                    ], height_index * 6 * 3);
            }

            // 📷 Camera
            const camera_globals = {
                "camera_size": <Const<Vec2>>{
                    type: "const",
                    x: 12 * window.innerWidth / window.innerHeight,
                    y: 12,
                },
                "camera_position": <Const<Vec2>>{ type: "const", x: 0, y: 16 },
                "x_vector": <Const<Vec2>>{ type: "const", x: 1, y: 0.5 },
                "y_vector": <Const<Vec2>>{ type: "const", x: -1, y: 0.5 },
                "z_vector": <Const<Vec2>>{ type: "const", x: 0, y: 1 },
            };

            // 🐢 Ground
            const ground_material = Shaders.generate_material(gl, {
                textures: {
                    "grass": await GLTexture.load(gl, "./images/grass.jpg"),
                },
                buffers: {
                    "world_position": GLTexture.create_buffer(gl, vertices),
                    "vertex_color": GLTexture.create_buffer(gl, color),
                },
                globals: {
                    ...camera_globals,

                    "grass": { type: "uniform", data: "sampler2D" },
                    "world_position": { type: "attribute", data: "vec3" },
                    "vertex_color": { type: "attribute", data: "vec3" },

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
                    ) / camera_size, -world_position.z * 0.25, 1.0);
                    gl_Position = final_position;
                    uv = world_position.xy;
                    color = vertex_color;
                }
            `, `
                void main(void) {
                    gl_FragColor = texture2D(grass, uv) * vec4(color, 0.0);
                }    
            `);

            // 🌊 Water
            const water_material = Shaders.generate_material(gl, {
                textures: {
                    "water": await GLTexture.load(gl, "./images/water.jpg"),
                    "foam": await GLTexture.load(gl, "./images/foam.jpg"),
                },
                buffers: {
                    "terrain_position": GLTexture.create_buffer(gl, vertices),
                },
                globals: {
                    ...camera_globals,

                    "water": { type: "uniform", data: "sampler2D" },
                    "foam": { type: "uniform", data: "sampler2D" },
                    "terrain_position": { type: "attribute", data: "vec3" },

                    "water_height": { type: "const", value: 0.75 },

                    "uv": { type: "varying", data: "vec2" },
                    "blend": { type: "varying", data: "float" },
                }
            }, `                
                void main(void) {
                    vec2 ortho_position =
                        terrain_position.x * x_vector +
                        terrain_position.y * y_vector +
                        max(terrain_position.z, water_height) * z_vector;
                    vec4 final_position = vec4((
                        ortho_position -
                        camera_position
                    ) / camera_size, -water_height * 0.25, 1.0);
                    gl_Position = final_position;
                    uv = terrain_position.xy;
                    blend = clamp((water_height - terrain_position.z) * 4.0, 0.0, 1.0);
                }
            `, `
                void main(void) {
                    gl_FragColor = vec4(mix(
                        texture2D(foam, uv).y * vec3(2.0,2.0, 2.0),
                        texture2D(water, uv).y * vec3(0.5, 0.7, 0.9),
                        blend), 1.0);
                }       
            `);

            { // 🙏 Set up gl context for rendering
                gl.clearColor(0, 0, 0, 0);
                gl.enable(gl.DEPTH_TEST);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.viewport(0, 0, canvas.width, canvas.height);
            }

            // 🎨 Draw materials
            Shaders.render_material(gl, ground_material, vertices.length);
            Shaders.render_material(gl, water_material, vertices.length);
        }
    }
}