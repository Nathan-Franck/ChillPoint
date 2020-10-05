import { Scripting } from "./Util.Scripting";

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
        [key in keyof T]: T[key]
    };

export type Dependant = { recalculate: () => void };

export type Derivative<T> = {
    affects: Set<Dependant>,
    require_recalculate: boolean,
} & {
        readonly [key in keyof T]: T[key]
    };

let dependant_stack: Stack<Dependant> = new Stack();

export function listener(response: () => void) {
    const reevaluate = () => {
        dependant_stack.push({ recalculate: reevaluate });
        try {
            response();
        } catch (e) {
            console.error(e);
        } finally {
            dependant_stack.pop();
        }
    }
    reevaluate();
}

export function derivative<T>(derived_from: (previous_cached: T | undefined) => T): Derivative<T> {
    let cached_value: T | undefined = undefined;

    const reevaluate = (): T | undefined => {
        dependant_stack.push({ recalculate });
        try {
            const new_value = derived_from(cached_value);
            for (const affect of affects) {
                affect.recalculate();
            }
            return new_value;
        } catch (e) {
            console.error(e);
        } finally {
            dependant_stack.pop();
        }
    }

    const affects = new Set<Dependant>();
    const recalculate = () => { require_recalculate = true };
    let require_recalculate = false;
    cached_value = reevaluate();

    return Scripting.get_keys(cached_value).reduce((result, key) => {
        completeAssign(result, {
            get [key]() {

                if (require_recalculate) {
                    require_recalculate = false;
                    cached_value = reevaluate();
                }

                const { last } = dependant_stack;
                if (last != null) {
                    affects.add(last);
                }
                return (cached_value as T)[key];
            },
        });
        return result;
    }, { affects, require_recalculate: false } as Derivative<T>);
}

// This is an assign function that copies full descriptors
function completeAssign(target: any, source: any) {
    Object.defineProperties(target, [...Object.keys(source), ...Object.getOwnPropertySymbols(source)].
        reduce((descriptors, key) => {
            return {
                ...descriptors,
                [key]: Object.getOwnPropertyDescriptor(source, key),
            };
        }, {}));
    return target;
}

export function variable<T>(value: T): Variable<T> {
    const cached_value = value;
    const affects = new Set();
    const variable = Scripting.get_keys(cached_value).reduce((result, key) => {
        completeAssign(result, {
            get [key]() {
                const { last } = dependant_stack;
                if (last != null) {
                    affects.add(last);
                }
                return cached_value[key];
            },
            set [key](value: T[typeof key]) {
                cached_value[key] = value;
                for (const affects of variable.affects) {
                    affects.recalculate();
                }
            },
        });
        return result;
    }, { affects } as Variable<T>);
    return variable;
}

export namespace Reactive {

    export function test() {
        const vari = variable({ value: 3, thought: "cool" });
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

Reactive.test();