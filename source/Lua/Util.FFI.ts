export namespace ForeignFunction {

    type Type = keyof BaseTypeLookup | string;
        
    type Parameters = {
        readonly [P: string]: Type;
    };

    type BaseTypeLookup = {
        "void": void,
        "int": number,
        "uint": number,
        "uint64_t": number,
        "float": number,
        "double": number,
        "char*": string,
        "const char*": string,
        "string": string,
    };

    type External<T extends string> = {
        [key in T]: void;
    };

    type FuncParam<T extends Type> = T extends keyof BaseTypeLookup ? BaseTypeLookup[T] : External<T>;

    // type FuncParams<T extends Parameters> = {
    //     [key in keyof T as ]: T[key] extends Type ? FuncParam<T[key]> : never;
    // };

    type NamedFuncParams<T extends Parameters> = {
        [key in keyof T]: FuncParam<T[key]>;
    };

    type HeaderFile = {
        readonly [function_name: string]: {
            readonly output: keyof BaseTypeLookup | string,
            readonly params: Parameters,
        }
    }

    type ExternInterface<H extends HeaderFile> = {
        [key in keyof H]: (
            args: FuncParam<H[key]["params"][string]>[]
        ) => FuncParam<H[key]["output"]>
    }

    type UsefulInterface<H extends HeaderFile> = {
        [key in keyof H]: (
            args: NamedFuncParams<H[key]["params"]>
        ) => FuncParam<H[key]["output"]>
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
                }(${Object.
                    entries(func.params).
                    map(([name, type]) => `${void_star_fallback(type)} ${name}`).
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
                const params = Object.entries(func.params);
                return [
                    function_name,
                    <UsefulInterface<H>[typeof function_name]>((args) => {
                        const ordered_args = params.map(([name]) => args[name as keyof typeof args]);
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

    const ffi = require("ffi") as {
        cdef: (this: void, header: string) => void,
        load: <T>(this: void, file: string) => T,
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
            types: wrapped_interface, // extern_interface,
            values: args.values,
        };
    }
}