// import { Shaders, Vec3, Vec4 } from "./Util.Shaders";
// import { Texture } from "./Util.Texture";
// import { HtmlBuilder } from "./Util.HtmlBuilder";
// import { Vec4Math } from "./Util.VecMath";

// export class SmoothCurve {
//     constructor(private values: number[]) { }
//     public sample(t: number) {
//         const smooth_index = t * this.values.length;
//         const index = Math.floor(smooth_index);
//         const current = Math.min(Math.max(index, 0), this.values.length - 1);
//         const next = Math.min(Math.max(index + 1, 0), this.values.length - 1);
//         const lerp = smooth_index - index;
//         return this.values[current] * (1 - lerp) + this.values[next] * lerp;
//     }
// }

// export namespace Forest {

//     export type DepthDefinition = {
//         Name: string,
//         SplitAmount: number,
//         Flatness: number,
//         Size: number,
//         HeightSpread: number,
//         BranchPitch: number,
//         BranchRoll: number,
//         HeightToGrowth: SmoothCurve,
//     }

//     export type Settings = {
//         StartSize: number,
//         StartGrowth: number,
//         DepthDefinitions:DepthDefinition[],
//     }

//     export type GenQueueItem = {
//         parentIndex: number,
//         node: Node,
//     }

//     export type Node = {
//         size: number,
//         position: Vec3,
//         rotation: Vec4,
//         growth: number,
//         split_depth: number,
//     }

//     export type Output = {
//         nodes: Node[],
//         node_to_primary_child_index: number[]
//     }

//     function generateStructure(settings: Settings) {
//             const start_node: Node = {
//                 size: settings.StartSize,
//                 position: { x: 0, y: 0, z: 0 },
//                 rotation: { x: 0, y: 0, z: 0, w: 1 },
//                 growth: settings.StartGrowth,
//                 split_depth: 0,
//             };
//             const generation_queue: GenQueueItem[] = [];
//             const output: Output = {
//                 nodes: [],
//                 node_to_primary_child_index: [],
//             };
//             generation_queue.unshift({
//                 parentIndex: -1,
//                 node: start_node,
//             });
//             while (generation_queue.length > 0) {
//                 const gen_item = generation_queue.pop();
//                 if (gen_item == null) { throw "💀" }
//                 const nodeIndex = output.nodes.length;
//                 output.nodes.push(gen_item.node);
//                 output.node_to_primary_child_index.push(-1);
//                 if (gen_item.parentIndex >= 0) {
//                     output.node_to_primary_child_index[gen_item.parentIndex] = nodeIndex;
//                 }
//                 // Branch spawning
//                 if (gen_item.node.split_depth < settings.DepthDefinitions.length) {
//                     const depth_definition = settings.DepthDefinitions[gen_item.node.split_depth];
//                     const split_amount = depth_definition.SplitAmount * gen_item.node.growth;
//                     const split_depth = gen_item.node.split_depth + 1;
//                     // Main branch extension
//                     {
//                         const growth = Math.min(Math.max(depth_definition.HeightToGrowth.sample(0), 0), 1);
//                         const up = Vec4Math.vec3_by_quat(
//                             gen_item.node.rotation,
//                             { x: 0, y: 0, z: gen_item.node.size * gen_item.node.growth });
//                         generation_queue.unshift({
//                             parentIndex: nodeIndex,
//                             node: {
//                                 position: ["x", "y", "z"].map((key: keyof Vec3) => gen_item.node.position[key] +
                                    
//                                 rotation: gen_item.node.rotation *
//                                         Quaternion.AngleAxis(
//                                             depth_definition.BranchRoll,
//                                             Vector3.up),
//                                 size: gen_item.node.size *
//                                     depth_definition.Size,
//                                 growth: growth,
//                                 split_depth,
//                             }});
//                         }
//                     // Tangental branches
//                     for (
//                         const splitIndex = 0;
//                         splitIndex < splitAmount;
//                         splitIndex++
//                     ) {
//                         const splitHeight = splitIndex * depthDefinition.HeightSpread / splitAmount;
//                         const growth = Mathf.Clamp01(
//                             depthDefinition.HeightToGrowth.Evaluate(splitHeight * gen_item.node.growth));
//                         generation_queue.Enqueue(new GenQueueItem {
//                             parentIndex = -1,
//                             node = new Node() {
//                                 position = gen_item.node.position +
//                                     gen_item.node.rotation * Vector3.up *
//                                     gen_item.node.size * gen_item.node.growth * (1 - splitHeight),
//                                 rotation = gen_item.node.rotation *
//                                     Quaternion.AngleAxis(
//                                         depthDefinition.BranchRoll +
//                                             Utils.FlattenAngle(
//                                                 splitIndex * 360.0f * 0.618f, depthDefinition.Flatness),
//                                         Vector3.up) *
//                                     Quaternion.AngleAxis(
//                                         depthDefinition.BranchPitch, Vector3.forward),
//                                 size = gen_item.node.size *
//                                     depthDefinition.Size,
//                                 growth = growth,
//                                 splitDepth = splitDepth
//                             }});
//                     }
//                 }
//             }
//             return output;
//     }

//     export async function render(
//         parent: HTMLElement,
//         camera: Camera.Type,
//     ) {
//         const canvas = HtmlBuilder.createChild(parent, {
//             type: "canvas",
//             style: {
//                 width: "100%",
//                 height: "100%",
//                 position: "absolute",
//                 left: 0,
//                 top: 0,
//                 zIndex: 0,
//             },
//             attributes: {
//                 width: window.innerWidth,
//                 height: window.innerHeight,
//             },
//         });
//         const gl = canvas.getContext('webgl2');
//         if (gl == null) {
//             return new Error("Canvas rendering context is invalid");
//         }

//         // 🌳 Beautiful trees ---
    

//         const meeple_material = Shaders.generate_material(gl, {
//             textures: {},
//             buffers: {
//                 "world_position": Texture.create_buffer(gl, world_positions),
//                 "vertex_color": Texture.create_buffer(gl, vertex_colors),
//             },
//             globals: {
//                 ...camera.globals,

//                 "world_position": { type: "attribute", data: "vec3" },
//                 "vertex_color": { type: "attribute", data: "vec3" },
                  
//                 "color": { type: "constying", data: "vec3" },
//             }
//         }, `            
//             ${camera.includes}

//             void main(void) {
//                 gl_Position = vec4(camera_transform(world_position), world_position.z * -0.25, 1.0);
//                 color = vertex_color;
//             }
//         `, `
//             void main(void) {
//                 gl_FragColor = vec4(color, 1.0);
//             }    
//         `);

//         { // 🙏 Set up gl context for rendering
//             gl.clearColor(0, 0, 0, 0);
//             gl.enable(gl.DEPTH_TEST);
//             gl.clear(gl.COLOR_BUFFER_BIT);
//             gl.viewport(0, 0, canvas.width, canvas.height);
//         }

//         // 🎨 Draw materials
//         Shaders.render_material(gl, meeple_material, world_positions.length);
// }