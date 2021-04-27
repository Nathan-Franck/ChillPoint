export namespace JSON {
    export function stringify(obj: any) {
        type Type = "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "cdata";
        const _type = (typeof obj) as Type;
        if (_type == "string")
            return `"${obj}"`;
        if (_type == "number")
            return `${obj}`;
        if (_type == "cdata")
            return `{}`;
        let isArray = true;
        const entries = Object.entries(obj);
        const stringifiedValues: string[] = entries.map(([key, value]) => {
            if (typeof key != "number")
                isArray = false;
            return stringify(value);
        });
        if (isArray)
            return `[${stringifiedValues.join(", ")}]`;
        return `{${stringifiedValues.map((value, index) => `"${entries[index][0]}": ${value}`).join(", ")}}`;
    }
}
