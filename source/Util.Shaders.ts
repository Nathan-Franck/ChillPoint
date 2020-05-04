import { Scripting } from "./Util.Scripting";

export namespace Shaders {
    type DataType = "float" | "vec2" | "vec3" | "vec4";
    type UniformType = "sampler2D";
    type S = string;
    type Const = {
        type: "const",
        value: number
    } | {
        type: "const",
        x: number,
        y: number,
    };
    type Varying = {
        type: "varying",
        data: DataType,
    };
    type Attribute = {
        type: "attribute",
        data: DataType,
    }
    type Uniform = {
        type: "uniform",
        data: UniformType,
    };
    type Props<C extends S> = {
        [key in C]: Const | Varying | Attribute | Uniform
    };

    export function globals<C extends S>(props: Props<C>) {
        return props;
    }

    export function constText(key: string, element: Const) {
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
    export function varyingText(key: string, element: Varying) {
        return `${element.type} highp ${element.data} ${key};`;
    }
    export function uniformAttributeText(key: string, element: Uniform | Attribute) {
        return `${element.type} ${element.data} ${key}; `
    }

    export function toVertText<C extends S>(props: Props<any>) {
        return Scripting.getKeys(props).reduce((text, key) => {
            const element = props[key];
            return `${text}\n ${
                element.type == "const" ?
                    constText(key, element) :
                    element.type == "varying" ?
                        varyingText(key, element) :
                        uniformAttributeText(key, element)
                }`;
        }, "");
    }

    export function toFragText<C extends S>(props: Props<any>) {
        return Scripting.getKeys(props).reduce((text, key) => {
            const element = props[key];
            return `${text}${
                element.type == "const" ?
                    constText(key, element) :
                    element.type == "varying" ?
                        varyingText(key, element) :
                        element.type == "uniform" ?
                            uniformAttributeText(key, element) :
                            ""
                }\n`;
        }, "");
    }
}