export namespace Scripting {
    export function getKeys<T>(obj: T): (keyof T)[] {
        return Object.keys(obj) as (keyof T)[];
    }
}