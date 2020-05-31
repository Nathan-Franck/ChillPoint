
import { Texture } from "./Util.Texture";
import { HtmlBuilder } from "./Util.HtmlBuilder";
import { Camera } from "./Util.Camera";
import { Vec3 } from "./Util.VecMath";
import { Shaders } from "./Util.Shaders";

export namespace Meeples {
	export async function render(
		parent: HTMLElement,
		camera: typeof Camera.default_camera,
	) {
		const canvas = HtmlBuilder.create_child(parent, {
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

		// 💀 Skeleton framework by which animations and mesh can be constructed on
		type Joint = "chest" | "hip" | "head" | "shoulder" | "elbow" | "wrist" | "finger" | "knee" | "ankle" | "toe";
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
				relative_position: [0, 0, 0],
				debug_color: [1, 1, 1],
			},
			head: {
				parent: "chest",
				relative_position: [0, 0, 0.5],
				debug_color: [1, 0, 0],
			},
			shoulder: {
				parent: "chest",
				relative_position: [.5, 0, 0],
				debug_color: [0, 0, 1],
				mirrored: true,
			},
			hip: {
				parent: "chest",
				relative_position: [0.25, 0, -1],
				debug_color: [0, 0, 1],
				mirrored: true,
			},
			elbow: {
				parent: "shoulder",
				relative_position: [.5, 0, 0],
				debug_color: [0, 1, 0],
				mirrored: true,
			},
			wrist: {
				parent: "elbow",
				relative_position: [.5, 0, 0],
				debug_color: [0, 1, 0],
				mirrored: true,
			},
			finger: {
				parent: "wrist",
				relative_position: [.5, 0, 0],
				debug_color: [0, 1, 0],
				mirrored: true,
			},
			knee: {
				parent: "hip",
				relative_position: [0, 0, -1],
				debug_color: [1, 0, 1],
				mirrored: true,
			},
			ankle: {
				parent: "knee",
				relative_position: [0, 0, -1],
				debug_color: [1, 0, 1],
				mirrored: true,
			},
			toe: {
				parent: "ankle",
				relative_position: [0, 0.25, 0],
				debug_color: [1, 0, 1],
				mirrored: true,
			},
		};

		// 🏭 Convert base-definition of skeleton into renderable bones
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
					let absolute_position = Vec3.add(
						bone.relative_position,
						parent_joint.relative_position);
					while (parent_joint.parent != null) {
						parent_joint = skeleton[parent_joint.parent];
						absolute_position = Vec3.add(
							absolute_position,
							parent_joint.relative_position);
					}
					return {
						joint,
						absolute_position,
						mirrored: bone.mirrored,
					};
				}).reduce<Array<readonly [Joint, Vec3]>>((processed_bones, bone) => {
					if (bone.mirrored) {
						return [
							...processed_bones, [
								bone.joint,
								bone.absolute_position,
							], [
								bone.joint, [
									-bone.absolute_position[0],
									bone.absolute_position[1],
									bone.absolute_position[2],
								]]];
					}
					return [...processed_bones, [
						bone.joint,
						bone.absolute_position,
					]];
				}, []);

		//🏀 Quick mockup for where skeleton joints should display
		const quad_to_triangles = [0, 1, 2, 2, 1, 3];
		const box_quads = {
			left: <Vec3[]>[
				[1, -1, -1],
				[1, 1, -1],
				[1, -1, 1],
				[1, 1, 1],
			],
			right: <Vec3[]>[
				[-1, -1, -1],
				[-1, 1, -1],
				[-1, -1, 1],
				[-1, 1, 1],
			],
			top: <Vec3[]>[
				[-1, 1, -1],
				[1, 1, -1],
				[-1, 1, 1],
				[1, 1, 1],
			],
			bottom: <Vec3[]>[
				[-1, -1, -1],
				[1, -1, -1],
				[-1, -1, 1],
				[1, -1, 1],
			],
			front: <Vec3[]>[
				[-1, -1, 1],
				[1, -1, 1],
				[-1, 1, 1],
				[1, 1, 1],
			],
			back: <Vec3[]>[
				[-1, -1, -1],
				[1, -1, -1],
				[-1, 1, -1],
				[1, 1, -1],
			],
		};

		const world_positions = new Float32Array(processed_bones.length * 6 * 6 * 3);
		const vertex_colors = new Float32Array(processed_bones.length * 6 * 6 * 3);
		const triangles = new Uint16Array(processed_bones.length * 6 * 6 * 3);

		processed_bones.forEach(([key, position], index) => {
			const offset = index * 6 * 6 * 3;
			const new_vertices = Object.values(box_quads).
				map(quad =>
					quad_to_triangles.
						map(quad_index =>
							Vec3.add(
								Vec3.scale(quad[quad_index], .1),
								position)).
						flat(1)).
				flat(1);
			world_positions.set(new_vertices, offset);
			const color = Object.values(skeleton[key].debug_color);
			const new_colors = new Array(6 * 6).fill(color);
			vertex_colors.set(new_colors.flat(1), offset);
		});

		// 🙋‍♂️ Meeples
		const meeple_material = Shaders.generate_material(gl, {
			globals: {
				...camera.globals,
				"world_position": {
					type: "attribute",
					unit: "vec3",
					data: Texture.create_buffer(gl, world_positions)
				},
				"vertex_color": {
					type: "attribute",
					unit: "vec3",
					data: Texture.create_buffer(gl, vertex_colors)
				},
				"color": { type: "varying", unit: "vec3" },
			},
			vert_source: `            
				${camera.includes}

				void main(void) {
					gl_Position = vec4(camera_transform(world_position), world_position.z * -0.25, 1.0);
					color = vertex_color;
				}
			`,
			frag_source: `
				void main(void) {
					gl_FragColor = vec4(color, 1.0);
				}    
			`
		});

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