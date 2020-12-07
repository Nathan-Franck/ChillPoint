import { sdl_header } from "./Lib.SDL";

export type FilterTypes<T extends { [key: string]: any }, U extends T[keyof T]> = {
    [key in keyof T as T[key] extends U ? key : never]: T[key];
}

export type Tuple<T, Key extends number> = readonly T[] & { readonly [key in `${Key}`]: T }

export function tuple_to_object<
    T extends Tuple<Elems, number>,
    Key extends keyof Elems,
    Value extends keyof Elems,
    Elems = { [key: string]: any },
>(tuple: T, key: Key, value: Value) {
    return tuple.reduce((obj, elem) => ({
        ...obj,
        //@ts-ignore
        [elem[key]]: elem[value],
    }), {} as {
        //@ts-ignore
        [key in keyof T as key extends `${number}` ? T[key][Key] : never]: key extends `${number}` ? T[key][Value] : never;
    })
}

const o2t_start = { this: { index: 0, message: "hey!" }, that: { index: 1, message: "ho!" } } as const;
type O2TStart = typeof o2t_start;
function o2t_target(a: "hey!", b: "ho!") {

}

type Ordered<T extends { index: number }> = { [key in string]: T };

type TupleUnion<U extends symbol | string | number, R extends any[] = []> = {
    [key in U]: Exclude<U, key> extends never ? [...R, key] : TupleUnion<Exclude<U, key>, [...R, key]>;
}[U];

type KeyWithOrder<T extends Ordered<any>, Index extends number> = keyof {
    [key in keyof T as T[key]["index"] extends Index ? key : never]: key
}
type TupleFromOrdered<
    T extends Ordered<any>,
    > = _TupleOf<T, []>;
type _TupleOf<
    T extends Ordered<any>,
    R extends unknown[],
    V = KeyWithOrder<T, R['length']>
    > = {} extends T ? R : _TupleOf<Pick<T, Exclude<keyof T, V>>, [...R, V]>;

type TU_Test = TupleUnion<"hey" | "ho" | "hum">["length"];


type kwo_test = KeyWithOrder<O2TStart, 1>;
type O2TTransformation = {
    [key in keyof O2TStart as O2TStart[key]["message"]]: { index: O2TStart[key]["index"] };
};
type Solution = TupleFromOrdered<O2TTransformation>;
const t2 = [] as any as Solution;
o2t_target(...t2);

export namespace Scripting {
    export function get_keys<T>(obj: T): (keyof T)[] {
        return Object.keys(obj) as (keyof T)[];
    }
    export function key_value_to_object<Key extends string | number, Value>(keys: readonly Key[], key_to_value: (key: Key) => Value) {
        return keys.
            map(key => [key, key_to_value(key)] as const).
            reduce<{ [key in Key]: Value }>((result, key_value) => ({
                ...result,
                [key_value[0]]: key_value[1],
            }), {} as { [key in Key]: Value })
    }
    export function transform_object<T, U>(
        obj: T,
        transform: <Key extends keyof T>(value: T[Key], key: Key) => U
    ) {
        return get_keys(obj).
            reduce((new_obj, key) => ({
                ...new_obj,
                [key]: transform(obj[key], key),
            }), {} as { [key in keyof T]: U });
    }
}