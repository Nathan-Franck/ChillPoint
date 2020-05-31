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

	const normals = [
		[0.5, 0.5, 0],
		[-0.5, 0.5, 0],
		[-0.5, -0.5, 0],
		[0.5, -0.5, 0],
		[0.5, 0.5, 0],
		[-0.5, 0.5, 0],
		[-0.5, -0.5, 0],
		[0.5, -0.5, 0],
	] as const;

	const triangles = [
		0, 1, 2, 2, 3, 0, // Bottom
		6, 5, 4, 4, 7, 6, // Top
		2, 1, 5, 5, 6, 2, // Left
		0, 3, 4, 4, 3, 7, // Right
		3, 2, 6, 6, 7, 3, // Back
		1, 0, 4, 4, 5, 1, // Forward
	] as const;

	export function generate_tapered_mesh(
		skeleton: Skeleton,
		settings: MeshSettings,
	) {
		const mesh = {
			vertices: new Float32Array(skeleton.nodes.length * 8 * 3),
			normals: new Float32Array(skeleton.nodes.length * 8 * 3),
			split_height: new Float32Array(skeleton.nodes.length * 8),
			triangles: new Uint16Array(skeleton.nodes.length * 6 * 6),
		} as const;
		skeleton.nodes.forEach((parent, node_index) => {
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
			const vertex_offset = node_index * 8 * 3;
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
				normals.flatMap(normal =>
					Vec3.normal(
						Vec3.apply_quat(
							normal,
							parent.rotation,
						))),
				vertex_offset);
			mesh.split_height.set(
				vertices.map(() => parent.split_height), node_index * 8);
			mesh.triangles.set(
				triangles.map(i => i + node_index * 8),
				node_index * 6 * 6);
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
			}]
		};

		const skeleton = generate_structure(diciduous);
		const mesh = generate_tapered_mesh(skeleton, diciduous);
		const model_position = new Float32Array(([
			[0, 0, 0],
			[4, 0, 0],
			[0, 4, 0],
			[4, 4, 0],
		] as const).flatMap(vec =>
			Vec3.add(vec, [16, 16, 0]))
		);
		const model_growth = new Float32Array([
			1, 0.2, 0.6, 0.4,
		]);

		const tree_material = Shaders.generate_material(gl, {
			element_buffer: Texture.create_element_buffer(gl, mesh.triangles),
			globals: {
				...camera.globals,

				"child_size": { type: "const", data: [diciduous.depth_definitions[0].size], },
				"scale": { type: "const", data: [3] },
				"model_position": {
					type: "attribute",
					unit: "vec3",
					data: Texture.create_buffer(gl, model_position),
					instanced: true,
				},
				"model_growth": {
					type: "attribute",
					unit: "float",
					data: Texture.create_buffer(gl, model_growth),
					instanced: true,
				},
				"vertex_position": {
					type: "attribute",
					unit: "vec3",
					data: Texture.create_buffer(gl, mesh.vertices),
				},
				"vertex_normal": {
					type: "attribute",
					unit: "vec3",
					data: Texture.create_buffer(gl, mesh.normals),
				},
				"vertex_split_height": {
					type: "attribute",
					unit: "float",
					data: Texture.create_buffer(gl, mesh.split_height),
				},

				"color": { type: "varying", unit: "vec3" },
			},
			vertSource: `            
				${camera.includes}

				void main(void) {
					float z_position = vertex_position.z - (1.0 - model_growth);
					float shrink_rate = -min(z_position, 0.0);
					vec3 shrunk_position = vec3(vertex_position.xy * mix(1.0, child_size, shrink_rate), z_position + shrink_rate);
					vec3 world_position = shrunk_position * scale + model_position;
					gl_Position = vertex_split_height > model_growth ?
						vec4(0) :
						vec4(camera_transform(world_position), world_position.z * -0.125, 1.0);
					color = vec3(dot(vertex_normal, -vec3(1.0, -1.0, -2.0)));
				}
			`,
			fragSource: `
				void main(void) {
					gl_FragData[0] = vec4(color, 1.0);
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
		Shaders.render_material(gl, tree_material, mesh.triangles.length, model_position.length / 3.0);
	}
}