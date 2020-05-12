import { Texture } from "./Util.Texture";
import { Shaders } from "./Util.Shaders";
import { HtmlBuilder } from "./Util.HtmlBuilder";
import { Camera } from "./Util.Camera";
import { Vec2, Vec3 } from "./Util.VecMath";
import { Indexing } from "./Util.Indexing";

export namespace Terrain {
    export async function render(
        parent: HTMLElement,
        camera: Camera.Type,
        chunk_width: number,
    ) {
        const canvas = HtmlBuilder.createChild(parent, {
            type: "canvas",
            style: {
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 0,
            },
            attributes: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
        });
        const gl = canvas.getContext('webgl2');
        if (gl == null) {
            return new Error("Canvas rendering context is invalid");
        }

        //const chunk_width = 32;
        const heights_width = chunk_width + 1;
        const chunk_size = chunk_width * chunk_width;
        const heights_size = heights_width * heights_width;

        let heights = new Array(heights_size);
        for (let i = 0; i < heights_size; i++) {
            heights[i] = Math.floor(Math.pow(Math.random(), 4) * 5);
            //heights[i] = i % 43 == 0 ? 2 : 0;
        }
        // 🌊 Erosion
        const erosion_samples: Vec2[] = [
            [-1, -1],
            [0, -1],
            [1, -1],
            [-1, 0],
            [1, 0],
            [-1, 1],
            [0, 1],
            [1, 1],
        ];
        for (let i = 0; i < 4; i++) {
            heights = heights.map((height, height_index) => ({
                height,
                coord: <Vec2>[
                    height_index % heights_width,
                    Math.floor(height_index / heights_width),
                ],
            })).map(height_info => {
                const other_height = erosion_samples.reduce<number>((height, sample) => {
                    const height_index = Indexing.to_index_bounded(
                        Vec2.add(sample, height_info.coord),
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

        const coords_offset_per_square: Vec2[] = [
            [ 0, 0 ],
            [ 1, 0 ],
            [ 0, 1 ],
            [ 1, 1 ],
        ];
        const sun_direction = Vec3.normal([ 1, -1, -2 ]);

        const vertices = new Float32Array(chunk_size * 6 * 3);
        const color = new Float32Array(chunk_size * 6 * 3);

        for (let height_index = 0; height_index < chunk_size; height_index++) {
            const height_coord: Vec2 = [
                height_index % heights_width,
                Math.floor(height_index / heights_width),
            ];

            const raw_vertices = coords_offset_per_square.map<Vec2>(vec => Vec2.add(
                vec, height_coord
            )).map(coord => (<Vec3>[
                ...coord.slice(0, 2),
                heights[Indexing.to_index(coord, heights_width)] * 0.5,
            ]));

            const new_vertices = (raw_vertices[0][2] != raw_vertices[3][2] ?
                [0, 1, 2, 2, 1, 3] :
                [1, 3, 0, 0, 3, 2]
            ).map(raw_index => raw_vertices[raw_index]);

            const shades = [
                [new_vertices[0], new_vertices[1], new_vertices[2]],
                [new_vertices[3], new_vertices[4], new_vertices[5]],
            ].map(verts => {
                const diff_a = Vec3.sub(verts[1], verts[0]);
                const diff_b = Vec3.sub(verts[2], verts[0]);
                const normal = Vec3.normal(Vec3.cross(diff_a, diff_b));
                return Math.max(-Vec3.dot(normal, sun_direction), 0) + 0.1;
            });

            vertices.set(
                new_vertices.flat(1),
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

        // 🐢 Ground
        const ground_material = Shaders.generate_material(gl, {
            textures: {
                "grass": await Texture.load(gl, "./images/grass.jpg"),
            },
            buffers: {
                "world_position": Texture.create_buffer(gl, vertices),
                "vertex_color": Texture.create_buffer(gl, color),
            },
            globals: {
                ...camera.globals,

                "grass": { type: "uniform", data: "sampler2D" },
                "world_position": { type: "attribute", data: "vec3" },
                "vertex_color": { type: "attribute", data: "vec3" },

                "uv": { type: "varying", data: "vec2" },
                "color": { type: "varying", data: "vec3" },
            }
        }, `            
            ${camera.includes}

            void main(void) {
                gl_Position = vec4(camera_transform(world_position), world_position.z * -0.25, 1.0);
                uv = world_position.xy;
                color = vertex_color;
            }
        `, `
            void main(void) {
                gl_FragColor = vec4(texture2D(grass, uv).rgb * color, 1.0);
            }    
        `);

        // 🌊 Water
        const water_material = Shaders.generate_material(gl, {
            textures: {
                "water": await Texture.load(gl, "./images/water.jpg"),
                "foam": await Texture.load(gl, "./images/foam.jpg"),
            },
            buffers: {
                "terrain_position": Texture.create_buffer(gl, vertices),
            },
            globals: {
                ...camera.globals,

                "water": { type: "uniform", data: "sampler2D" },
                "foam": { type: "uniform", data: "sampler2D" },
                "terrain_position": { type: "attribute", data: "vec3" },

                "water_height": { type: "const", data: [ 0.75 ] },

                "uv": { type: "varying", data: "vec2" },
                "blend": { type: "varying", data: "float" },
            }
        }, `    
            ${camera.includes}

            void main(void) {
                gl_Position = vec4(
                    camera_transform(vec3(
                        terrain_position.x,
                        terrain_position.y,
                        max(terrain_position.z, water_height))
                ), water_height * -0.25, 1.0);
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