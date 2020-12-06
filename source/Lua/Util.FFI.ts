import { Scripting } from "./Util.Scripting";

export const ffi = require("ffi") as {
    cdef: (this: void, header: string) => void,
    load: <T>(this: void, file: string) => T,
    string: (this: void, string: any) => string,
    new: (this: void, type: string, args?: any) => any,
    typeof: (this: void, type: string) => (this: void, ...args: any) => any,
};

export type External<T extends string> = {
    [key in T]: void;
} | null;

export namespace FFI {

    export function new_array<T extends keyof BaseTypeLookup>(from: `${T}[${number}]`) {
        return ffi.new(from) as External<`${T}*`> & { [key: number]: BaseTypeLookup[T] };
    }

    type NamedParameter = {
        readonly type: keyof BaseTypeLookup | string,
        readonly index: number,
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
        "SDL_EventFilter": "void*",
        "SDL_eventaction": "void*",
        "SDL_SystemCursor": "void*",
    } as const;

    type FuncParam<T extends NamedParameter> = T["type"] extends keyof BaseTypeLookup ? BaseTypeLookup[T["type"]] : External<T["type"]>;

    type HeaderFile = {
        readonly [function_name: string]: {
            readonly output: keyof BaseTypeLookup | string,
            readonly params: { readonly [key: string]: NamedParameter; },
        }
    }

    type ExternInterface<H extends HeaderFile> = {
        [key in keyof H]: H[key]["params"] extends {
            readonly [key: string]: {
                readonly type: infer U;
            };
        } ? (...params: Array<U>) => FuncParam<{ index: 0, type: H[key]["output"] }>
        : never;
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
                }(${Scripting.get_keys(func.params).
                    map(key => ({ name: key, ...func.params[key] })).
                    map(arg => `${void_star_fallback(arg.type)} ${arg.name}`).
                    join(", ")
                });`).
            join("\n");
    }

    export function load_library<H extends HeaderFile, C>(args: {
        file_name: string,
        header: H,
        values: C,
    }) {
        const cdef_header = generate_cdef_header(args.header);
        ffi.cdef(cdef_header);
        const extern_interface = ffi.load<ExternInterface<H>>(args.file_name);
        // const wrapped_interface = wrap_interface(args.header, extern_interface);
        return {
            types: extern_interface,
            values: args.values,
        };
    }
}