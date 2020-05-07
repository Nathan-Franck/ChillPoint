
    import { Texture } from "./Util.Texture";
    import { Shaders } from "./Util.Shaders";
    import { Vec3Math, VecMath } from "./VecMath";
    import { HtmlBuilder } from "./Util.HtmlBuilder";
    import { Camera } from "./Util.Camera";

export namespace Meeples {
    export async function render(
        parent: HTMLElement, 
        camera: Camera.Type,
    ) {
        {
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

            // 🙋‍♂️ Meeples
            const meeple_material = Shaders.generate_material(gl, {
                textures: {},
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
            { // 🙏 Set up gl context for rendering
                gl.clearColor(0, 0, 0, 0);
                gl.enable(gl.DEPTH_TEST);
                gl.clear(gl.COLOR_BUFFER_BIT);
                gl.viewport(0, 0, canvas.width, canvas.height);
            }

            // 🎨 Draw materials
            Shaders.render_material(gl, meeple_material, vertices.length);
        }
    }
}
}