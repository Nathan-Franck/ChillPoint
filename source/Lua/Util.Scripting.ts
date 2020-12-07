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

const o2t_start = { length: 2, this: { order: 0, message: "hey!" }, that: { order: 1, message: "ho!" } } as const;
type O2TStart = typeof o2t_start;
function o2t_target(a: "hey!", b: "ho!") {

}

type Ordered<T extends { order: number }> = { [key: string]: T } & { length: number };

type KeyWithOrder<T extends Ordered<any>, Index extends number> = keyof {
    [key in keyof T as T[key]["order"] extends Index ? key : never]: key
}
type TupleFromOrdered<
    T extends Ordered<any>,
    N = T['length']
    > = N extends N ? number extends N ? T[] : N extends number ? _TupleOf<T, N, []> : never : never;
type _TupleOf<
    T extends Ordered<any>,
    N extends T['length'],
    R extends unknown[],
    V = KeyWithOrder<T, R['length']>
    > = R['length'] extends N ? R : _TupleOf<T, N, [...R, V]>;

type kwo_test = KeyWithOrder<O2TStart, 1>;
//@ts-ignore
type O2TTransform = { length: O2TStart["length"] } & { [key in keyof O2TStart as key extends "length" ? never : O2TStart[key]["message"]]: { order: O2TStart[key]["order"] } };
type Solution = TupleFromOrdered<O2TTransform>;
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