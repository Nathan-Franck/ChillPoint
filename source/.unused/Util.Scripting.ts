
export type FilterFlags<Base, Condition> = {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never
};

export type AllowedKeys<Base, Condition> =
    FilterFlags<Base, Condition>[keyof Base];


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
}