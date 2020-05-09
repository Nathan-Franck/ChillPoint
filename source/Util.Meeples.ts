
import { Texture } from "./Util.Texture";
import { Shaders, Vec2, Vec3 } from "./Util.Shaders";
import { HtmlBuilder } from "./Util.HtmlBuilder";
import { Camera } from "./Util.Camera";
import { Vec3Math } from "./VecMath";

export namespace Meeples {
    export async function render(
        parent: HTMLElement,
        camera: Camera.Type,
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

        // 💀 framework by which animations and mesh can be constructed on
        type Joint = "chest" | "hip" | "head" | "shoulder"
        //  | "elbow" | "wrist" | "finger" | "knee" | "ankle" | "toe";
        type BoneInfo<T> = {
            parent: T | null,
            relative_position: Vec3,
            debug_color: Vec3,
            mirrored?: true,
        };
        type Bone<T> = BoneInfo<T> & {
            joint: T,
        };
        const skeleton: {
            [key in Joint]: BoneInfo<Joint>
        } = {
            chest: {
                parent: null,
                relative_position: { x: 0, y: 0, z: 0 },
                debug_color: { x: 1, y: 1, z: 1 },
            },
            hip: {
                parent: "chest",
                relative_position: { x: 0.25, y: 0, z: -1 },
                debug_color: { x: 0, y: 0, z: 1 },
                mirrored: true,
            },
            head: {
                parent: "chest",
                relative_position: { x: 0, y: 0, z: 0.5 },
                debug_color: { x: 1, y: 0, z: 0 },
            },
            shoulder: {
                parent: "chest",
                relative_position: { x: .5, y: 0, z: 0 },
                debug_color: { x: 0, y: 1, z: 0 },
                mirrored: true,
            },
        };

        //🏀 Quick mockup for where skeleton joints should display
        const box_points = [
            { x: -1, y: -1, z: -1 },
            { x: 1, y: -1, z: -1 },
            { x: -1, y: 1, z: -1 },
            { x: 1, y: 1, z: -1 },
            { x: -1, y: -1, z: 1 },
            { x: 1, y: -1, z: 1 },
            { x: -1, y: 1, z: 1 },
            { x: 1, y: 1, z: 1 },
        ];
        const quad_to_triangles = [0, 1, 2, 2, 1, 3];
        const box_quads = {
            left: [
                { x: 1, y: -1, z: -1 },
                { x: 1, y: 1, z: -1 },
                { x: 1, y: -1, z: 1 },
                { x: 1, y: 1, z: 1 },
            ],
            right: [
                { x: -1, y: -1, z: -1 },
                { x: -1, y: 1, z: -1 },
                { x: -1, y: -1, z: 1 },
                { x: -1, y: 1, z: 1 },
            ],
            top: [
                { x: -1, y: 1, z: -1 },
                { x: 1, y: 1, z: -1 },
                { x: -1, y: 1, z: 1 },
                { x: 1, y: 1, z: 1 },
            ],
            bottom: [
                { x: -1, y: -1, z: -1 },
                { x: 1, y: -1, z: -1 },
                { x: -1, y: -1, z: 1 },
                { x: 1, y: -1, z: 1 },
            ],
            front: [
                { x: -1, y: -1, z: 1 },
                { x: 1, y: -1, z: 1 },
                { x: -1, y: 1, z: 1 },
                { x: 1, y: 1, z: 1 },
            ],
            back: [
                { x: -1, y: -1, z: -1 },
                { x: 1, y: -1, z: -1 },
                { x: -1, y: 1, z: -1 },
                { x: 1, y: 1, z: -1 },
            ],
        };

        const processed_bones =
            (Object.entries(skeleton) as [Joint, Bone<Joint>][]).
                map(([joint, bone]) => {
                    if (bone.parent == null) {
                        return {
                            joint,
                            mirrored: bone.mirrored,
                            absolute_position: bone.relative_position
                        };
                    }
                    let parent_joint = skeleton[bone.parent];
                    let absolute_position = Vec3Math.add(
                        bone.relative_position,
                        parent_joint.relative_position);
                    while (parent_joint.parent != null) {
                        absolute_position = Vec3Math.add(
                            absolute_position,
                            parent_joint.relative_position);
                        parent_joint = skeleton[parent_joint.parent];
                    }
                    return {
                        joint,
                        absolute_position,
                        mirrored: bone.mirrored,
                    };
                }).reduce<[Joint, Vec3][]>((processed_bones, bone) => {
                    if (bone.mirrored) {
                        return [...processed_bones, [
                            bone.joint,
                            bone.absolute_position,
                        ], [
                            bone.joint,
                            {
                                ...bone.absolute_position,
                                x: -bone.absolute_position.x,
                            },
                        ],
                        ];
                    }
                    return [...processed_bones, [
                        bone.joint,
                        bone.absolute_position,
                    ]];
                }, []);

        const world_positions = new Float32Array(processed_bones.length * 6 * 6 * 3);
        const vertex_colors = new Float32Array(processed_bones.length * 6 * 6 * 3);

        processed_bones.forEach(([key, position], index) => {
            const offset = index * 6 * 6 * 3;
            const new_vertices = Object.values(box_quads).
                map(quad =>
                    quad_to_triangles.
                        map(quad_index =>
                            Vec3Math.add(
                                Vec3Math.scale(quad[quad_index], .1),
                                position)).
                        map(vec => ([vec.x, vec.y, vec.z])).
                        flat(1)).
                flat(1);
            world_positions.set(new_vertices, offset);
            const color = Object.values(skeleton[key].debug_color);
            const new_colors = new Array(6 * 6).fill(color);
            vertex_colors.set(new_colors.flat(1), offset);
        });

        // 🙋‍♂️ Meeples
        const meeple_material = Shaders.generate_material(gl, {
            textures: {},
            buffers: {
                "world_position": Texture.create_buffer(gl, world_positions),
                "vertex_color": Texture.create_buffer(gl, vertex_colors),
            },
            globals: {
                ...camera.globals,

                "world_position": { type: "attribute", data: "vec3" },
                "vertex_color": { type: "attribute", data: "vec3" },

                "color": { type: "varying", data: "vec3" },
            }
        }, `            
            ${camera.includes}

            void main(void) {
                gl_Position = vec4(camera_transform(world_position), world_position.z * -0.25, 1.0);
                color = vertex_color;
            }
        `, `
            void main(void) {
                gl_FragColor = vec4(color, 1.0);
            }    
        `);

        { // 🙏 Set up gl context for rendering
            gl.clearColor(0, 0, 0, 0);
            gl.enable(gl.DEPTH_TEST);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.viewport(0, 0, canvas.width, canvas.height);
        }

        // 🎨 Draw materials
        Shaders.render_material(gl, meeple_material, world_positions.length);
    }
}