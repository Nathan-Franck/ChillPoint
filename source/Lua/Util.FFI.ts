export namespace ForeignFunction {
    const ffi = require("ffi") as {
        cdef: (this: void, header: string) => void,
        load: <T>(this: void, file: string) => T,
    };

    export function load_library<Types, Constants>(args: {
        file_name: string,
        simplified_header: string,
        values: Constants,
        types: Types,
    }): { types: Types, values: Constants } {
        
        ffi.cdef(args.simplified_header);
        return {
            types: ffi.load<Types>(args.file_name),
            values: args.values,
        };
    }
}