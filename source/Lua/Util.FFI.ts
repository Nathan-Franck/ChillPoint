import { sdl_header } from "./Lib.SDL";
import { Ordered, Scripting, TupleFromOrdered } from "./Util.Scripting";
import { ExcludeFromTuple, ExtractFromTuple } from "./Util.Tuple";

export const ffi = require("ffi") as {
    cdef: (this: void, header: string) => void,
    load: <T>(this: void, file: string) => T,
    string: (this: void, string: any) => string,
    new: (this: void, type: string, args?: any) => any,
    typeof: (this: void, type: string) => (this: void, ...args: any) => any,
};

export type External<T extends string> = {
    [key in T]: void;
} & {
    [key: string]: any;   
};

export namespace Refs {
    export type Blueprint = { [key: string]: keyof FFI.BaseTypeLookup };
    export type Type<T extends Blueprint> = { [key in keyof T]: FFI.Array<T[key]> };
    export function create<T extends Blueprint>(blueprint: T) {
        return Scripting.
            get_keys(blueprint).
            reduce((result, key) => ({
                ...result,
                [key]: FFI.new_array<typeof blueprint[typeof key]>(blueprint[key], 1),
            }), {} as Type<T>);
    }
    export function result<T extends Blueprint>(pointers: Type<T>) {
        return Scripting.
            get_keys(pointers).
            reduce((result, key) => ({
                ...result,
                [key]: pointers[key][0],
            }), {} as { [key in keyof T]: FFI.BaseTypeLookup[T[key]] });
    }
}

export namespace FFI {

    export type Array<T extends keyof BaseTypeLookup> = External<`${T}*`> & { [key: number]: BaseTypeLookup[T] };

    export function new_array<T extends keyof BaseTypeLookup>(from: T, count: number) {
        return ffi.new(`${from}[${count}]`) as Array<T>;
    }

    type NamedParameter = {
        index: number,
        type: keyof BaseTypeLookup | string,
    };

    export type BaseTypeLookup = {
        "void": void,
        "int": number,
        "uint": number,
        "float": number,
        "double": number,
        "char*": string,
        "const char*": string,
        "string": string,

        // 🚧 Temp SDL specific 🚧
        "SDL_bool": boolean,
        "Uint8": number,
        "Uint32": number,
        "Uint64": number,
        "SDL_DisplayOrientation": number,
        "SDL_GLattr": number,
        "SDL_HitTest": number,
        "SDL_RendererFlip": number,
        "SDL_ScaleMode": number,
        "SDL_BlendMode": number,
        "SDL_Renderer": void,
    };

    const FFIHeaderLookup = {
        "uint": "int",
        "char*": "const char*",
        "const char*": "const char*",

        // 🚧 Temp SDL specific 🚧
        "SDL_Surface*": "SDL_Surface*",
        "SDL_TimerCallback": "void*",
        "SDL_YUV_CONVERSION_MODE": "void*",
        "SDL_bool": "bool",
        "SDL_TimerID": "int",
        "SDL_DisplayOrientation": "int",
        "SDL_GLContext": "void*",
        "SDL_GLattr": "int",
        "Uint8": "int",
        "Uint32": "int",
        "Uint64": "uint64_t",
        "SDL_HitTest": "int",
        "SDL_RendererFlip": "int",
        "SDL_ScaleMode": "int",
        "SDL_BlendMode": "int",
        "SDL_EventFilter": "void*",
        "SDL_eventaction": "void*",
        "SDL_SystemCursor": "void*",
    } as const;

    type FuncParam<T extends NamedParameter["type"]> = T extends keyof BaseTypeLookup ? BaseTypeLookup[T] : External<T> | null;

    type FuncParams<T extends Ordered<NamedParameter>> = {
        [key in keyof T]: {
            index: T[key]["index"],
            type: FuncParam<T[key]["type"]>,
        }
    };

    export type HeaderFile = {
        readonly [function_name: string]: {
            readonly output: keyof BaseTypeLookup | string,
            readonly params: Record<string, NamedParameter>,
        }
    }

    export type FunctionParams<T extends HeaderFile[string]> = TupleFromOrdered<FuncParams<T["params"]>, "type">;

    export type ExternInterface<H extends HeaderFile> = {
        [key in keyof H]: (
            ...args: FunctionParams<H[key]>
        ) => FuncParam<H[key]["output"]>
    }

    function void_star_fallback(type: string) {
        const lookup_result: string | undefined = FFIHeaderLookup[type as keyof typeof FFIHeaderLookup]
        if (lookup_result != null) {
            return lookup_result;
        }
        return type.endsWith("*") ? "void*" : type;
    }

    function multi_return_interface<T extends HeaderFile>(header: T, cdef_header: ExternInterface<T>) {
        type NamedParams<T extends Ordered<NamedParameter>> = {
            [key in keyof T]: FuncParam<T[key]["type"]>
        };
        return Scripting.get_keys(header).
            reduce((multi_interface, function_name) => {
                try {
                    const cdef_function = cdef_header[function_name];
                    const head_function = header[function_name];
                    const resulting_func = (args: NamedParams<typeof head_function.params>) => {
                        const params_array = Scripting.get_keys(args).
                            reduce((param_tuple, key) => {
                                if (!(key in head_function.params)) { return param_tuple; }
                                const index = head_function.params[key].index;
                                param_tuple[index] = args[key];
                                return param_tuple;
                            }, [] as any[])
                        //@ts-ignore
                        const result = cdef_function(...params_array);
                        return result;
                    }
                    return {
                        ...multi_interface,
                        [function_name]: resulting_func,
                    };
                } catch {
                    return multi_interface;
                }
            }, {} as { [key in keyof T]: (args: NamedParams<T[key]["params"]>) => FuncParam<T[key]["output"]> });
    }

    function generate_cdef_header(header: HeaderFile) {
        const result = Object.
            entries(header).
            map(([function_name, func]) => `${void_star_fallback(func.output)
                } ${function_name
                }(${Object.entries(func.params).
                    sort(([_1, value_1], [_2, value_2]) => value_1.index - value_2.index).
                    map(([key, value]) => `${void_star_fallback(value.type)} ${key}`).
                    join(", ")
                });`).
            join("\n");
        return result;
    }

    export function load_library<H extends HeaderFile, C>(args: {
        file_name: string,
        header: H,
        values: C,
    }) {
        const cdef_header = generate_cdef_header(args.header);
        ffi.cdef(cdef_header);
        const extern_interface = ffi.load<ExternInterface<H>>(args.file_name);
        return {
            types: extern_interface,
            values: {
                ...args.values,
                ...multi_return_interface(args.header, extern_interface),
            },
            header: args.header,
        };
    }
}