import { Scripting } from "./Util.Scripting";
import { Vec2, Vec3, Vec4 } from "./Util.VecMath";

export type GLSLType = "float" | "vec2" | "vec3" | "vec4";
export type GLSLConstType = Single | Vec2 | Vec3 | Vec4;
export type GLSLUniformType = "sampler2D";
export type Single = [number];
export type Const<T extends GLSLConstType> = {
    type: "const",
    data: T,
};
export type Varying<T extends GLSLType> = {
    type: "varying",
    data: T,
};
export type Attribute<T extends GLSLType> = {
    type: "attribute",
    data: T,
}
export type Uniform<T extends GLSLUniformType> = {
    type: "uniform",
    data: T,
};
export const type_to_stride: { [key in GLSLType]: number } = {
    float: 1,
    vec2: 2,
    vec3: 3,
    vec4: 4,
};

export type ShaderGlobals<Textures, Buffers, T> = {
    [key in keyof T]: Const<GLSLConstType> | Varying<GLSLType> | Attribute<GLSLType> | Uniform<GLSLUniformType>
} & {
        [key in keyof Textures]: Uniform<"sampler2D">
    } & {
        [key in keyof Buffers]: Attribute<GLSLType>
    };

export namespace Shaders {

    export function const_text(key: string, element: Const<GLSLConstType>) {
        const { data: value } = element;
        if (value.length == 1) {
            return `const highp float ${key} = ${value[0]};`
        }
        return `const highp vec${value.length} ${key} = ${
                `vec${value.length}(${(value as number[]).reduce<string>((output, value, index) =>
                    `${output}${index > 0 ? ", " : ""}${value}`, "")}`
            });`
    }
    export function varying_text(key: string, element: Varying<any>) {
        return `${element.type} highp ${element.data} ${key};`;
    }
    export function uniform_attribute_text(key: string, element: Uniform<any> | Attribute<any>) {
        return `${element.type} ${element.data} ${key}; `
    }

    export function to_vert_text<Textures, Buffers, T>(props: ShaderGlobals<Textures, Buffers, T>) {
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

    export function to_frag_text<Textures, Buffers, T>(props: ShaderGlobals<Textures, Buffers, T>) {
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

    export function validate_environment<Textures, Buffers, T>(params: {
        textures: Textures,
        buffers: Buffers,
        globals: ShaderGlobals<Textures, Buffers, T>,
    }) {
        return params;
    }

    export type Material<Textures, Buffers, T> = {
        program: WebGLProgram,
        textures: Textures,
        element_buffer?: WebGLBuffer,
        buffers: Buffers,
        globals: ShaderGlobals<Textures, Buffers, T>,
    };

    export function generate_material<Textures, Buffers, T>(
        gl: WebGL2RenderingContext,
        environment: {
            textures: Textures,
            element_buffer?: WebGLBuffer,
            buffers: Buffers,
            globals: ShaderGlobals<Textures, Buffers, T>,
        },
        vertSource: string,
        fragSource: string,
    ): Material<Textures, Buffers, T> {
        // ✨🎨 Create fragment shader object
        const program = gl.createProgram();
        {
            if (program == null) {
                throw new Error("Vertex/Fragment shader not properly initialized");
            }
            const vertFullSource = `
                ${Shaders.to_vert_text(environment.globals)}
                ${vertSource}
            `;
            const fragFullSource = `
                ${Shaders.to_frag_text(environment.globals)}
                ${fragSource}
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
        };
    }

    export function render_material<Textures, Buffers, T>(
        gl: WebGL2RenderingContext,
        material: Material<Textures, Buffers, T>,
        element_length: number,
    ) {
        gl.useProgram(material.program);

        { // 🦗 Texture to display
            Scripting.getKeys(material.textures).forEach((key, index) => {
                gl.activeTexture(gl.TEXTURE0 + index);
                gl.bindTexture(gl.TEXTURE_2D, material.textures[key]);

                const uniformLocation = gl.getUniformLocation(material.program, key as string);
                gl.uniform1i(uniformLocation, index);
            });
        }

        { // 👇 Set the points of the triangle to a buffer, assign to shader attribute
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, material.element_buffer || null);
            Scripting.getKeys(material.buffers).forEach(key => {
                gl.bindBuffer(gl.ARRAY_BUFFER, material.buffers[key]);
                const attributeLocation = gl.getAttribLocation(material.program, key as string);
                const dataType = material.globals[key].data;
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