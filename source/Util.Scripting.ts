
export type FilterFlags<Base, Condition> = {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never
};

export type AllowedKeys<Base, Condition> =
    FilterFlags<Base, Condition>[keyof Base];


export namespace Scripting {
	export function getKeys<T>(obj: T): (keyof T)[] {
		return Object.keys(obj) as (keyof T)[];
	}
}