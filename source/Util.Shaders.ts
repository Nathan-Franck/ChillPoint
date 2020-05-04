import { Scripting } from "./Util.Scripting";

export namespace Shaders {

    type Props<ConstKeys extends string> = {
        const: { [key in ConstKeys]: number | { x: number, y: number } },
        varying: {},
        attribute: {},
    };

    export function globals<T extends string>(props: Props<T>) {
        return props;
    }

    export function toText<T extends string>(props: Props<T>) {
        Scripting.getKeys(props.const).reduce((text, key) => {
            const value = props.const[key];
            return `${text}\n const ${
                typeof value == "number" ?
                    "float" :
                    "vec2"
                } ${key} = ${
                typeof value == "number" ?
                    value.toFixed(2) :
                    `vec2(${value.x}, ${value.y})`
                };`
        }, "");
    }
}