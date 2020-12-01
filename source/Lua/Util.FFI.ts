export namespace ForeignFunction {

    type NamedParameter = {
        type: keyof BaseTypeLookup | string,
        name: string,
    };

    type BaseTypeLookup = {
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
    };

    const FFIHeaderLookup = {
        "uint": "int",
        "char*": "const char*",
        "const char*": "const char*",

        // 🚧 Temp SDL specific 🚧
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
    } as const;

    type External<T extends string> = {
        [key in T]: void;
    } | null;

    type FuncParam<T extends NamedParameter> = T["type"] extends keyof BaseTypeLookup ? BaseTypeLookup[T["type"]] : External<T["type"]>;

    type FuncParams<T extends readonly NamedParameter[]> = {
        [key in keyof T]: T[key] extends NamedParameter ? FuncParam<T[key]> : never;
    };

    type NamedFuncParams<T extends readonly NamedParameter[]> = {
        [key in keyof T as T[key] extends NamedParameter ? T[key]["name"] : never]: T[key] extends NamedParameter ? FuncParam<T[key]> : never;
    };

    type HeaderFile = {
        readonly [function_name: string]: {
            readonly output: keyof BaseTypeLookup | string,
            readonly params: readonly NamedParameter[]
        }
    }

    type ExternInterface<H extends HeaderFile> = {
        [key in keyof H]: (
            /*@ts-ignore*/
            ...args: FuncParams<H[key]["params"]>
        ) => FuncParam<{ name: "output", type: H[key]["output"] }>
    }

    type UsefulInterface<H extends HeaderFile> = {
        [key in keyof H]: (
            args: NamedFuncParams<H[key]["params"]>
        ) => FuncParam<{ name: "output", type: H[key]["output"] }>
    }

    function void_star_fallback(type: string) {
        const lookup_result: string | undefined = FFIHeaderLookup[type as keyof typeof FFIHeaderLookup]
        if (lookup_result != null) {
            return lookup_result;
        }
        return type.endsWith("*") ? "void*" : type;   
    }

    function generate_cdef_header(header: HeaderFile) {
        return Object.
            entries(header).
            map(([function_name, func]) => `${void_star_fallback(func.output)
                } ${function_name
                }(${func.params.
                    filter((arg): arg is NamedParameter => "name" in arg).
                    map(arg => `${void_star_fallback(arg.type)} ${arg.name}`).
                    join(", ")
                });`).
            join("\n");
    }

    function entries<T>(obj: T) {
        return Object.entries(obj) as [keyof T, T[keyof T]][];
    }

    function wrap_interface<H extends HeaderFile>(header: H, extern_interface: ExternInterface<H>): UsefulInterface<H> {
        return entries(header).
            map(([function_name, func]) => {
                const { params } = func;
                return [
                    function_name,
                    <UsefulInterface<H>[typeof function_name]>((args) => {
                        const ordered_args = params.map(param => args[param.name as keyof typeof args]);
                        // @ts-ignore
                        return extern_interface[function_name](...ordered_args);
                    }),
                ] as const;
            }).
            reduce((result, [function_name, new_func]) => ({
                ...result,
                [function_name]: new_func,
            }), {} as UsefulInterface<H>);
    }

    export const ffi = require("ffi") as {
        cdef: (this: void, header: string) => void,
        load: <T>(this: void, file: string) => T,
        string: (this: void, string: any) => string,
        new: (this: void, type: string, args: any),
    };

    export function load_library<H extends HeaderFile, C>(args: {
        file_name: string,
        header: H,
        values: C,
    }) {
        const cdef_header = generate_cdef_header(args.header);
        ffi.cdef(cdef_header);
        const extern_interface = ffi.load<ExternInterface<H>>(args.file_name);
        const wrapped_interface = wrap_interface(args.header, extern_interface);
        return {
            types: extern_interface,
            values: args.values,
        };
    }
}