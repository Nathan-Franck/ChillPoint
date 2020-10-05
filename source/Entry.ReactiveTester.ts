import { Scripting } from "./Util.Scripting";

export namespace ReactiveTester {

    class Stack<T> {
        private _store: T[] = [];
        push(val: T) {
            this._store.push(val);
        }
        pop(): T | undefined {
            return this._store.pop();
        }
        get last(): T | undefined {
            if (this._store.length == 0)
                return undefined;
            return this._store[this._store.length - 1];
        }
    }

    export type Variable<T> = {
        affects: Set<Derivative<any>>
    } & {
            [key in keyof T]: T[keyof T]
        };

    export type Dependant = { clear_cache: () => void };

    export type Derivative<T> = {
        affects: Set<Dependant>,
        cached_value: T | undefined,
        clear_cache: () => void,
    } & {
            readonly [key in keyof T]: T[keyof T]
        };

    let dependant_stack: Stack<Dependant> = new Stack();

    export function derivative<T>(derived_from: () => T): Derivative<T> {

        const reevaluate = (): T | undefined => {
            console.log("reevaluate");
            dependant_stack.push({ clear_cache });
            try {
                const new_value = derived_from();
                for (const affect of affects) {
                    affect.clear_cache();
                }
                return new_value;
            } catch(e) {
                console.exception(e);
            } finally {
                dependant_stack.pop();
            }
        }

        const affects = new Set<Dependant>();
        const clear_cache = () => { cached_value = undefined };
        let cached_value: T | undefined = reevaluate();

        return Scripting.get_keys(cached_value).reduce((result, key) => {
            return {
                ...result,
                get [key]() {

                    if (cached_value == undefined) {
                        cached_value = reevaluate();
                    }

                    const { last } = dependant_stack;
                    if (last != null) {
                        affects.add(last);
                    }
                    return (cached_value as T)[key];
                },
            };
        }, { cached_value, affects, clear_cache } as Derivative<T>);
    }

    export function variable<T>(value: T): Variable<T> {
        const cached_value = value;
        const affects = new Set();
        const variable = Scripting.get_keys(cached_value).reduce((result, key) => {
            return {
                ...result,
                get [key]() {
                    const { last } = dependant_stack;
                    if (last != null) {
                        affects.add(last);
                    }
                    return cached_value[key];
                },
                set [key](value: T[keyof T]) {
                    cached_value[key] = value;

                    console.log("clear affects");
                    for (const affects of variable.affects) {
                        affects.clear_cache();
                    }
                },
            };
        }, { affects } as Variable<T>);
        return variable;
    }

    export function test() {
        const vari = variable({ value: 3 });
        vari.value = 5;
        const deri = derivative(() => ({ squared: vari.value * vari.value }));
        const demi = derivative(() => ({ cubed: vari.value * deri.squared }));
        console.log(deri.squared);
        console.log(demi.cubed);
        vari.value = 2;
        console.log(deri.squared);
        console.log(demi.cubed);
    }
}

ReactiveTester.test();