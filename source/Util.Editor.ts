import { HtmlBuilder } from "./Util.HtmlBuilder";

export namespace Editor {
    export function render(
        parent: HTMLElement,
    ) {
        const textEditor = HtmlBuilder.create_child(parent, {
            type: "div",
            style: {
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
                zIndex: 3,
                color: "white",
                backgroundColor: "transparent",
                wordWrap: "break-word",
                fontFamily: "Trebuchet MS",
                whiteSpace: "pre",
                overflow: "scroll",
            },
            attributes: {
                innerHTML: sample_text,
                contentEditable: "true",
                spellcheck: false,
            },
        });

    }
}

const sample_text = `
import { Shaders } from "./Util.Shaders";
import { Texture } from "./Util.Texture";
import { HtmlBuilder } from "./Util.HtmlBuilder";
import { Vec3, Quat, Num, Mat4 } from "./Util.VecMath";
import { Camera } from "./Util.Camera";

export type SmoothCurve = {
	y_values: number[],
	x_range: [number, number],
}

export namespace SmoothCurve {
	export function sample(curve: SmoothCurve, time: number) {
		const smooth_index =
			(time - curve.x_range[0]) /
			(curve.x_range[1] - curve.x_range[0]) *
			curve.y_values.length;
		const index = Math.floor(smooth_index);
		const current = Math.min(Math.max(index, 0), curve.y_values.length - 1);
		const next = Math.min(Math.max(index + 1, 0), curve.y_values.length - 1);
		const lerp = smooth_index - index;
		return curve.y_values[current] * (1 - lerp) + curve.y_values[next] * lerp;
	}
}

export namespace Forest {

	export type DepthDefinition = {
		readonly name: string,
		readonly split_amount: number,
		readonly flatness: number,
		readonly size: number,
		readonly height_spread: number,
		readonly branch_pitch: number,
		readonly branch_roll: number,
		readonly height_to_growth: SmoothCurve,
	}

	export type Settings = {
		readonly start_size: number,
		readonly start_growth: number,
		readonly depth_definitions: DepthDefinition[],
	}

	export type MeshSettings = {
		readonly thickness: number,
		readonly leaves: {
			split_depth: number,
			length: number,
			breadth: number,
		},
		readonly growth_to_thickness: SmoothCurve,
	}

	export type GenQueueItem = Node & {
		readonly parent_index?: number,
	}

	export type Node = {
		readonly size: number,
		readonly position: Vec3,
		readonly rotation: Quat,
		readonly split_height: number,
		readonly growth: number,
		readonly split_depth: number,
	}

	function generate_structure(settings: Settings) {

		const start_node = {
			size: settings.start_size,
			position: [0, 0, 0],
			rotation: [0, 0, 0, 1],
			split_height: 0,
			growth: settings.start_growth,
			split_depth: 0,
		} as const;

		const generation_queue: GenQueueItem[] = [];
		const nodes = [];
		const node_to_primary_child_index = [];

		generation_queue.push(start_node);
		let gen_item;
		while ((gen_item = generation_queue.pop()) != null) {
			const node_index = nodes.length;
			nodes.push(gen_item);
			node_to_primary_child_index.push(undefined);
			if (gen_item.parent_index != null) {
				node_to_primary_child_index[gen_item.parent_index] = node_index;
			}

			// 🐣 Branch spawning
			if (gen_item.split_depth < settings.depth_definitions.length) {
				const depth_definition = settings.depth_definitions[gen_item.split_depth];
				const split_amount = depth_definition.split_amount * gen_item.growth;
				const split_depth = gen_item.split_depth + 1;

				// 🌴 Main branch extension
				{
					const growth = Num.clamp(
						SmoothCurve.sample(
							depth_definition.height_to_growth, 0),
						0, 1);
					const up = Vec3.apply_quat(
						[0, 0, gen_item.size * gen_item.growth],
						gen_item.rotation);
					generation_queue.unshift({
						parent_index: node_index,
						position: Vec3.add(gen_item.position, up),
						rotation: Quat.mul(gen_item.rotation,
							Quat.axis_angle(
								[0, 0, 1],
								depth_definition.branch_roll)),
						size: gen_item.size *
							depth_definition.size,
						split_height: split_depth == 1 ? 0 : gen_item.split_height,
						growth: growth,
						split_depth,
					});
				}

				// 🌿 Tangental branches
				for (
					let splitIndex = 0;
					splitIndex < split_amount;
					splitIndex++
				) {
					const split_height = splitIndex / split_amount;
					const growth = Num.clamp(
						SmoothCurve.sample(
							depth_definition.height_to_growth,
							split_height * gen_item.growth),
						0, 1);
					generation_queue.unshift({
						position: Vec3.add(gen_item.position,
							Vec3.apply_quat(
								[0, 0, gen_item.size * gen_item.growth * (1 - split_height * depth_definition.height_spread)],
								gen_item.rotation)),
						rotation: Quat.mul(
							gen_item.rotation,
							Quat.mul(
								Quat.axis_angle(
									[0, 0, 1],
									depth_definition.branch_roll +
									Num.flatten_angle(
										splitIndex * 6.283 * 0.618, depth_definition.flatness),
								),
								Quat.axis_angle(
									[0, 1, 0],
									depth_definition.branch_pitch))),
						size: gen_item.size *
							depth_definition.size,
						growth,
						split_height: split_depth == 1 ? split_height : gen_item.split_height,
						split_depth
					});
				}
			}
		}
		return {
			nodes,
			node_to_primary_child_index,
		} as const;
	}

	type Skeleton = ReturnType<typeof generate_structure>;

	const bark_normals = [
		[0.5, 0.5, 0],
		[-0.5, 0.5, 0],
		[-0.5, -0.5, 0],
		[0.5, -0.5, 0],
		[0.5, 0.5, 0],
		[-0.5, 0.5, 0],
		[-0.5, -0.5, 0],
		[0.5, -0.5, 0],
	] as const;

	const bark_triangles = [
		0, 1, 2, 2, 3, 0, // Bottom
		6, 5, 4, 4, 7, 6, // Top
		2, 1, 5, 5, 6, 2, // Left
		0, 3, 4, 4, 3, 7, // Right
		3, 2, 6, 6, 7, 3, // Back
		1, 0, 4, 4, 5, 1, // Forward
	] as const;

	const leaf_triangles = [
		0, 1, 2, 2, 3, 0
	] as const;

	const leaf_normals = [
		[0, 1, 0],
		[-0.2, 0.8, 0],
		[0, 1, 0],
		[0.2, 0.8, 0],
	] as const;

	export function generate_tapered_wood(
		skeleton: Skeleton,
		settings: MeshSettings,
	) {
		const mesh = {
			vertices: new Float32Array(skeleton.nodes.length * 8 * 3),
			normals: new Float32Array(skeleton.nodes.length * 8 * 3),
			split_height: new Float32Array(skeleton.nodes.length * 8),
			triangles: new Uint16Array(skeleton.nodes.length * 6 * 6),
		} as const;
		skeleton.nodes.
			filter(node => node.split_depth != settings.leaves.split_depth).
			forEach((parent, node_index) => {
				const child_index = skeleton.node_to_primary_child_index[node_index];
				const child = child_index == null ? parent :
					skeleton.nodes[child_index];
				const grandchild_index = child_index == null ? null :
					skeleton.node_to_primary_child_index[child_index];
				const grandchild = grandchild_index == null ? child :
					skeleton.nodes[grandchild_index];
				const height = parent.size * parent.growth;
				const parent_size = Num.lerp(child.size, parent.size, parent.growth) * settings.thickness;
				const child_size = Num.lerp(grandchild.size, child.size, child.growth) * settings.thickness;
				const vertices = [
					[0.5 * parent_size, 0.5 * parent_size, 0], // 0
					[-0.5 * parent_size, 0.5 * parent_size, 0], // 1
					[-0.5 * parent_size, -0.5 * parent_size, 0], // 2
					[0.5 * parent_size, -0.5 * parent_size, 0], // 3
					[0.5 * child_size, 0.5 * child_size, height], // 4
					[-0.5 * child_size, 0.5 * child_size, height], // 5
					[-0.5 * child_size, -0.5 * child_size, height], // 6
					[0.5 * child_size, -0.5 * child_size, height], // 7
				] as const;
				const vertex_offset = node_index * vertices.length * 3;
				mesh.vertices.set(
					vertices.flatMap(vertex =>
						Vec3.apply_mat4(
							vertex,
							Mat4.rot_trans(
								parent.rotation,
								parent.position,
							))),
					vertex_offset);
				mesh.normals.set(
					bark_normals.flatMap(normal =>
						Vec3.normal(
							Vec3.apply_quat(
								normal,
								parent.rotation,
							))),
					vertex_offset);
				mesh.split_height.set(
					vertices.map(() => parent.split_height), node_index * vertices.length);
				mesh.triangles.set(
					bark_triangles.map(i => i + node_index * vertices.length),
					node_index * bark_triangles.length);
			});
		return mesh;
	}

	export function generate_leaves(
		skeleton: Skeleton,
		settings: MeshSettings,
	) {
		const mesh = {
			vertices: new Float32Array(skeleton.nodes.length * 4 * 3),
			normals: new Float32Array(skeleton.nodes.length * 4 * 3),
			split_height: new Float32Array(skeleton.nodes.length * 4),
			triangles: new Uint16Array(skeleton.nodes.length * 6),
		} as const;
		skeleton.nodes.
			filter(node => node.split_depth == settings.leaves.split_depth).
			forEach((node, node_index) => {
				const length = node.size * settings.leaves.length;
				const breadth = node.size * settings.leaves.breadth;
				const vertices = [
					[0, 0, 0], // 0
					[breadth * 0.4, breadth * 0.1, length * 0.5], // 1
					[0, 0, length], // 2
					[breadth * -0.4, breadth * 0.1, length * 0.5], // 3
				] as const;
				const vertex_offset = node_index * vertices.length * 3;
				mesh.vertices.set(
					vertices.flatMap(vertex =>
						Vec3.apply_mat4(
							vertex,
							Mat4.rot_trans(
								node.rotation,
								node.position,
							))),
					vertex_offset);
				mesh.normals.set(
					leaf_normals.flatMap(normal =>
						Vec3.normal(
							Vec3.apply_quat(
								normal,
								node.rotation,
							))),
					vertex_offset);
				mesh.split_height.set(
					vertices.map(() => node.split_height), node_index * vertices.length);
				mesh.triangles.set(
					leaf_triangles.map(i => i + node_index * vertices.length),
					node_index * leaf_triangles.length);
			});
		return mesh;
	}

	export async function render(
		parent: HTMLElement,
		camera: typeof Camera.default_camera,
	) {
		const canvas = HtmlBuilder.create_child(parent, {
			type: "canvas",
			style: {
				// ...ChillpointStyles.blurred,
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

		// 🌳 Beautiful trees ---
		const diciduous: Settings & MeshSettings = {
			start_size: 1,
			start_growth: 1,
			thickness: 0.05,
			leaves: {
				split_depth: 4,
				length: 1,
				breadth: .3,
			},
			growth_to_thickness: {
				y_values: [0.0025, 0.035],
				x_range: [0, 1]
			},
			depth_definitions: [{
				name: "Branch-A",
				split_amount: 10,
				flatness: 0,
				size: 0.3,
				height_spread: 0.8,
				branch_pitch: 50,
				branch_roll: 90,
				height_to_growth: {
					y_values: [0, 1],
					x_range: [0, 0.25]
				},
			}, {
				name: "Branch-B",
				split_amount: 6,
				flatness: 0.6,
				size: 0.4,
				height_spread: 0.8,
				branch_pitch: 60 / 180 * Math.PI,
				branch_roll: 90 / 180 * Math.PI,
				height_to_growth: {
					y_values: [0.5, 0.9, 1],
					x_range: [0, 0.5]
				},
			}, {
				name: "Branch-C",
				split_amount: 10,
				flatness: 0,
				size: 0.4,
				height_spread: 0.8,
				branch_pitch: 40 / 180 * Math.PI,
				branch_roll: 90 / 180 * Math.PI,
				height_to_growth: {
					y_values: [0.5, 0.8, 1, 0.8, .5],
					x_range: [0, 0.5]
				},
			}, {
				name: "Leaf",
				split_amount: 10,
				flatness: 0,
				size: 0.7,
				height_spread: 0.8,
				branch_pitch: 40 / 180 * Math.PI,
				branch_roll: 90 / 180 * Math.PI,
				height_to_growth: {
					y_values: [0.5, 0.8, 1, 0.8, .5],
					x_range: [0, 0.5]
				},
			}]
		};

		{ // 🙏 Set up gl context for rendering
			gl.clearColor(0, 0, 0, 0);
			gl.enable(gl.DEPTH_TEST);
			gl.clear(gl.COLOR_BUFFER_BIT);
			gl.viewport(0, 0, canvas.width, canvas.height);
		}

		// 🎨 Draw materials
		Shaders.render_material(gl, bark_material, bark_mesh.triangles.length, model_position.length / 3.0);
		Shaders.render_material(gl, leaf_material, leaf_mesh.triangles.length, model_position.length / 3.0);
	}
}
`;