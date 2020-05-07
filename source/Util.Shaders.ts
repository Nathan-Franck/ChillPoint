import { Scripting } from "./Util.Scripting";

export type GLSLType = "float" | "vec2" | "vec3" | "vec4";
export type GLSLConstType = Float | Vec2 | Vec3 | Vec4;
export type GLSLUniformType = "sampler2D";
export type Float = { value: number };
export type Vec2 = { x: number, y: number };
export type Vec3 = { x: number, y: number, z: number };
export type Vec4 = { x: number, y: number, z: number, w: number };
export type Const<T extends GLSLConstType> = {
    type: "const",
} & T;
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
export const typeToStride: { [key in GLSLType]: number } = {
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

    export function constText(key: string, element: Const<any>) {
        return `const highp ${
            "w" in element ?
                "vec4" :
                "z" in element ?
                    "vec3" :
                    "y" in element ?
                        "vec2" :
                        "float"
            } ${key} = ${
            "w" in element ?
                `vec4(${element.x.toFixed(1)}, ${element.y.toFixed(1)}, ${element.z.toFixed(1)}, ${element.w.toFixed(1)})` :
                "z" in element ?
                    `vec3(${element.x.toFixed(1)}, ${element.y.toFixed(1)}, ${element.z.toFixed(1)})` :
                    "y" in element ?
                        `vec2(${element.x.toFixed(1)}, ${element.y.toFixed(1)})` :
                        element.value.toFixed(1)
            };`
    }
    export function varyingText(key: string, element: Varying<any>) {
        return `${element.type} highp ${element.data} ${key};`;
    }
    export function uniformAttributeText(key: string, element: Uniform<any> | Attribute<any>) {
        return `${element.type} ${element.data} ${key}; `
    }

    export function toVertText<Textures, Buffers, T>(props: ShaderGlobals<Textures, Buffers, T>) {
        return Scripting.getKeys(props).reduce((text, key) => {
            const element = props[key];
            return `${text}\n ${
                element.type == "const" ?
                    constText(key as string, element) :
                    element.type == "varying" ?
                        varyingText(key as string, element) :
                        uniformAttributeText(key as string, element)
                }`;
        }, "");
    }

    export function toFragText<Textures, Buffers, T>(props: ShaderGlobals<Textures, Buffers, T>) {
        return Scripting.getKeys(props).reduce((text, key) => {
            const element = props[key];
            return `${text}${
                element.type == "const" ?
                    constText(key as string, element) :
                    element.type == "varying" ?
                        varyingText(key as string, element) :
                        element.type == "uniform" ?
                            uniformAttributeText(key as string, element) :
                            ""
                }\n`;
        }, "");
    }

    export function validateEnvironment<Textures, Buffers, T>(params: {
        textures: Textures,
        buffers: Buffers,
        globals: ShaderGlobals<Textures, Buffers, T>,
    }) {
        return params;
    }

    export type Material<Textures, Buffers, T> = {
        program: WebGLProgram,
        textures: Textures,
        buffers: Buffers,
        globals: ShaderGlobals<Textures, Buffers, T>,
    };

    export function generate_material<Textures, Buffers, T>(
        gl: WebGL2RenderingContext,
        environment: {
            textures: Textures,
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
                ${Shaders.toVertText(environment.globals)}
                ${vertSource}
            `;
            const fragFullSource = `
                ${Shaders.toFragText(environment.globals)}
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
        triangle_length: number,
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
            Scripting.getKeys(material.buffers).forEach(key => {
                gl.bindBuffer(gl.ARRAY_BUFFER, material.buffers[key]);
                const attributeLocation = gl.getAttribLocation(material.program, key as string);
                const dataType = material.globals[key].data;
                gl.vertexAttribPointer(attributeLocation, typeToStride[dataType], gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(attributeLocation);
            });
        }

        gl.drawArrays(gl.TRIANGLES, 0, triangle_length);
    }
}