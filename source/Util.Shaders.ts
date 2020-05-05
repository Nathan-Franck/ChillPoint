import { Scripting } from "./Util.Scripting";
import { GLTexture } from "./GLTexture";

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

    export function generate_shader<Textures, Buffers, T>(
        gl: WebGL2RenderingContext,
        environment: {
            textures: Textures,
            buffers: Buffers,
            globals: ShaderGlobals<Textures, Buffers, T>,
        },
        vertSource: string,
        fragSource: string,
    ) {
        // ✨🎨 Create fragment shader object
        const glProgram = gl.createProgram();
        {
            const vertShader = gl.createShader(gl.VERTEX_SHADER);
            const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
            if (vertShader == null ||
                fragShader == null ||
                glProgram == null) {
                return new Error("Vertex/Fragment shader not properly initialized");
            }

            const vertFullSource = `
                ${Shaders.toVertText(environment.globals)}
                ${vertSource}
            `;
            const fragFullSource = `
                ${Shaders.toFragText(environment.globals)}
                ${fragSource}
            `;
            gl.shaderSource(vertShader, vertFullSource);
            gl.shaderSource(fragShader, fragFullSource);

            [vertShader, fragShader].forEach(shader => {
                gl.compileShader(shader);
                gl.attachShader(glProgram, shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.error(gl.getShaderInfoLog(shader));
                }
            });

            gl.linkProgram(glProgram);
        }

        { // 🦗 Texture to display
            Scripting.getKeys(environment.textures).forEach((key, index) => {
                gl.activeTexture(gl.TEXTURE0 + index);
                gl.bindTexture(gl.TEXTURE_2D, environment.textures[key]);

                const uniformLocation = gl.getUniformLocation(glProgram, key as string);
                gl.uniform1i(uniformLocation, index);
            });
        }

        { // 👇 Set the points of the triangle to a buffer, assign to shader attribute
            Scripting.getKeys(environment.buffers).forEach(key => {
                gl.bindBuffer(gl.ARRAY_BUFFER, environment.buffers[key]);
                const attributeLocation = gl.getAttribLocation(glProgram, key as string);
                const dataType = environment.globals[key].data;
                gl.vertexAttribPointer(attributeLocation, typeToStride[dataType], gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(attributeLocation);
            });
        }

        return glProgram;
    }
}