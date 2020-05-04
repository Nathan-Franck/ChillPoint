import { Scripting } from "./Util.Scripting";
import { GLTexture } from "./GLTexture";

export type GLSLType = "float" | "vec2" | "vec3" | "vec4";
export type GLSLUniformType = "sampler2D";
export type Float = { value: number };
export type Vec2 = { x: number, y: number };
export type Const<T extends Float | Vec2> = {
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

export type ShaderGlobals<Textures, Buffers, T> = T & {
    [key in keyof Textures]: Uniform<"sampler2D">
} & {
    [key in keyof Buffers]: Attribute<GLSLType>   
};

export namespace Shaders {

    export function constText(key: string, element: Const<any>) {
        return `const highp ${
            "value" in element ?
                "float" :
                "vec2"
            } ${key} = ${
            "value" in element ?
                element.value.toFixed(1) :
                `vec2(${element.x.toFixed(1)}, ${element.y.toFixed(1)})`
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
}