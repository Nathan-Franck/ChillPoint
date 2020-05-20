import { Scripting } from "./Util.Scripting";
import { Vec2, Vec3, Vec4 } from "./Util.VecMath";

export type GLSLUnit = "float" | "vec2" | "vec3" | "vec4";
export type GLSLConstType = Single | Vec2 | Vec3 | Vec4;
export type GLSLUniformUnit = "sampler2D";
export type Single = readonly [number];
export type Const = {
    readonly type: "const",
    readonly data: GLSLConstType,
};
export type Varying = {
    readonly type: "varying",
    readonly unit: GLSLUnit,
};
export type Attribute = {
    readonly type: "attribute",
    readonly unit: GLSLUnit,
    readonly data: WebGLBuffer,
}
export type Uniform = {
    readonly type: "uniform",
    readonly unit: GLSLUniformUnit,
    readonly data: WebGLTexture,
};
export const type_to_stride = {
    float: 1,
    vec2: 2,
    vec3: 3,
    vec4: 4,
} as const;

export type ShaderGlobals = {
    readonly [key: string]:
    | Const
    | Varying
    | Attribute
    | Uniform
};

export namespace Shaders {

    export function const_text(key: string, element: Const) {
        const { data } = element;
        if (data.length == 1) {
            return `const highp float ${key} = ${data[0].toFixed(4)};`
        }
        return `const highp vec${data.length} ${key} = ${
            `vec${data.length}(${(data as readonly number[]).reduce<string>((output, value, index) =>
                `${output}${index > 0 ? ", " : ""}${value.toFixed(4)}`, "")}`
            });`
    }
    export function varying_text(key: string, element: Varying) {
        return `${element.type} highp ${element.unit} ${key};`;
    }
    export function uniform_attribute_text(key: string, element: Uniform | Attribute) {
        return `${element.type} ${element.unit} ${key}; `
    }

    export function to_vert_text(props: ShaderGlobals) {
        return Scripting.getKeys(props).reduce((text, key) => {
            const element = props[key];
            return `${text}\n ${
                element.type == "const" ?
                    const_text(key as string, element) :
                    element.type == "varying" ?
                        varying_text(key as string, element) :
                        uniform_attribute_text(key as string, element)
                }`;
        }, "");
    }

    export function to_frag_text(props: ShaderGlobals) {
        return Scripting.getKeys(props).reduce((text, key) => {
            const element = props[key];
            return `${text}${
                element.type == "const" ?
                    const_text(key as string, element) :
                    element.type == "varying" ?
                        varying_text(key as string, element) :
                        element.type == "uniform" ?
                            uniform_attribute_text(key as string, element) :
                            ""
                }\n`;
        }, "");
    }

    export type Material = {
        readonly program: WebGLProgram,
        readonly element_buffer?: WebGLBuffer,
        readonly globals: ShaderGlobals,
    };

    export function generate_material(
        gl: WebGL2RenderingContext,
        environment: {
            readonly element_buffer?: WebGLBuffer,
            readonly globals: ShaderGlobals,
            readonly vertSource: string,
            readonly fragSource: string,
        },
    ) {
        // ✨🎨 Create fragment shader object
        const program = gl.createProgram();
        {
            if (program == null) {
                throw new Error("Vertex/Fragment shader not properly initialized");
            }
            const vertFullSource = `
                ${Shaders.to_vert_text(environment.globals)}
                ${environment.vertSource}
            `;
            const fragFullSource = `
                ${Shaders.to_frag_text(environment.globals)}
                ${environment.fragSource}
            `;
            [vertFullSource, fragFullSource].forEach((source, index) => {
                const shader = gl.createShader(index == 0 ? gl.VERTEX_SHADER : gl.FRAGMENT_SHADER);
                if (shader == null) {
                    throw new Error("Vertex/Fragment shader not properly initialized");
                }
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                gl.attachShader(program, shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    const split_info = gl.getShaderInfoLog(shader)?.split("ERROR:");
                    if (split_info != null) {
                        const errors = split_info.slice(1, split_info?.length);
                        for (let error of errors) {
                            const location = error.split(":")[1];
                            console.log(source.split("\n")[parseInt(location) - 1])
                            console.error(error);
                        }
                    }
                }
            });

            gl.linkProgram(program);
        }

        return {
            program,
            ...environment,
        } as const;
    }

    export function render_material(
        gl: WebGL2RenderingContext,
        material: Material,
        element_length: number,
    ) {
        gl.useProgram(material.program);

        { // 🦗 Texture to display
            Object.entries(material.globals)
                .filter((entry): entry is [string, Uniform] =>
                    "data" in entry[1] && entry[1].data instanceof WebGLTexture)
                .forEach((entry, index) => {
                    const [key, global] = entry;
                    gl.activeTexture(gl.TEXTURE0 + index);
                    gl.bindTexture(gl.TEXTURE_2D, global.data);

                    const uniformLocation = gl.getUniformLocation(material.program, key as string);
                    gl.uniform1i(uniformLocation, index);
                });
        }

        { // 👇 Set the points of the triangle to a buffer, assign to shader attribute
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, material.element_buffer || null);
            Object.entries(material.globals)
                .filter((entry): entry is [string, Attribute] =>
                    "data" in entry[1] && entry[1].data instanceof WebGLBuffer)
                .forEach(entry => {
                    const [key, global] = entry;
                    gl.bindBuffer(gl.ARRAY_BUFFER, global.data);
                    const attributeLocation = gl.getAttribLocation(material.program, key as string);
                    const dataType = global.unit;
                    gl.vertexAttribPointer(attributeLocation, type_to_stride[dataType], gl.FLOAT, false, 0, 0);
                    gl.enableVertexAttribArray(attributeLocation);
                });
        }

        if (material.element_buffer != null) {
            gl.drawElements(gl.TRIANGLES, element_length, gl.UNSIGNED_SHORT, 0);
        } else {
            gl.drawArrays(gl.TRIANGLES, 0, element_length);
        }
    }
}