import { HtmlBuilder, Style } from "./Util.HtmlBuilder";

async function display_parser() {
    HtmlBuilder.assign_to_element(document.body, {
        style: {
            backgroundColor: "black",
            display: "grid",
            justifyItems: "center",
            alignItems: "center",
            gridTemplateColumns: "1fr",
            gridTemplateRows: "1fr",

            height: "100%",
            width: "100%",
            margin: "0",
        },
    });

    const { container } = HtmlBuilder.create_children(document.body, {
        container: {
            type: "div",
            style: {
                height: "100%",
                width: "100%",

                backgroundColor: "grey",
                color: "white",
                fontFamily: "verdana",

                display: "grid",
                justifyItems: "center",
                alignItems: "center",
                gridTemplateAreas: `a b`,
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr",
            },
        }
    });

    const file = await fetch("SDL.h");
    const text = await file.text();
    const style: Style = {
        backgroundColor: "black",
        color: "white",
        fontFamily: "verdana",
        height: "100%",
        width: "100%",
        whiteSpace: "nowrap",
    };

    function range(count: number) {
        return [...Array(count).keys()];
    }
    function assert(statement: boolean) {
        if (!statement) throw new Error("assertion failed");
    }

    const comment_formatting = {
        "\\sa": "@see",
        "\\brief ": "",
        "\\note": "@remarks",
        "\\return": "@returns",
        "\\li": "*",
        "\\param": "@param",
    };

    // 🚧 Actual parsing work
    const processed = (() => {
        function split(text: string, by: string | RegExp) {
            const intermediate = text.split(by);
            return intermediate.slice(1, intermediate.length);
        }

        const defines = {} as Record<string, { args: string[], contents: string }>;
        {
            const macro_statements = split(text, /(?=#ifdef|#ifndef|#else|#endif|#define)/);
            while (macro_statements.length > 0) {
                const statement = macro_statements.shift()!;
                const type = statement.match(/#ifdef|#ifndef|#else|#endif|#define/)![0];
                const space_split = statement.split(/\s+|\(/);
                const define_key = space_split[1];
                const [_, define_args_content] = statement.split(/\(|\)/);
                const define_args = define_args_content?.split(",").map(arg => arg.trim()) || [];

                // If there's a newline before finding a backslash, then it's the end of the #define value
                const define_value = (() => {
                    const define_value_components = statement.slice(
                        statement.indexOf(define_key) + 
                        define_key.length +
                        (define_args_content == null ? 0 : define_args_content.length + 2),
                        statement.length).split(`\r\n`);
                    const value_end = define_value_components.findIndex(comp => comp[comp.length - 1] != "\\");
                    return define_value_components.slice(0, value_end + 1).join("\n");
                })();

                switch (type) {
                    case "#ifdef":
                        // 🤚 Skip all statements inside of invalid #ifdef statementsd
                        if (defines[define_key] == null) {
                            let end_statement = macro_statements.shift()!;
                            while (end_statement.match(/#endif|#else/)?.[0] == null) {
                                end_statement = macro_statements.shift()!;
                            }
                        }
                        break;
                    case "#ifndef":
                        // 🤚 Skip all statements inside of invalid #ifndef statements
                        if (defines[define_key] != null) {
                            let end_statement = macro_statements.shift()!;
                            while (end_statement.match(/#endif|#else/)?.[0] == null) {
                                end_statement = macro_statements.shift()!;
                            }
                        }
                        break;
                    case "#else":
                        // 🤚 Skip all statements inside of invalid #else statements (any that aren't parsed as part of #ifdef/#ifndef handling)
                        let end_statement = macro_statements.shift()!;
                        while (end_statement.match(/#endif/)?.[0] == null) {
                            end_statement = macro_statements.shift()!;
                        }
                        break;
                    case "#define":
                        defines[define_key] = { args: define_args, contents: define_value };
                        break;
                }
            }
        }

        const split_by_externs = split(text, "extern");
        const statements = split_by_externs.
            map((extern, index) => {
                try {
                    const previous = index > 0 ? split_by_externs[index - 1] : "";
                    const statement = extern.split(";")[0];
                    const flattened = statement.split(`\r\n`).map(elem => elem.trim()).join('');
                    const ignored = flattened.split(/DECLSPEC|SDLCALL|const/).
                        map(elem => elem.trim()).
                        filter(elem => elem.length > 0).
                        join(' ');
                    const [outer, inner] = ignored.split(/\(|\)/);
                    const type_name = (word: string) => {
                        const star_spaced = word.
                            split("*").
                            join("* ");
                        const outer_elems = star_spaced.split(" ").map(elem => elem.trim());
                        if (outer_elems.length == 1) {
                            return undefined;
                        }
                        const [name, ...type] = outer_elems.reverse();
                        return { type: type.reverse().join(''), name };
                    }
                    const { type: output, name: function_name } = type_name(outer)!;

                    const params = inner?.split(",").
                        map(param => type_name(param)).
                        reduce((params, param, index) => {
                            if (param == null) return params;
                            return {
                                ...params,
                                [param.name]: {
                                    type: param.type,
                                    index,
                                },
                            }
                        }, {} as { [key: string]: { type: string, index: number } }) || [];

                    const comments = previous?.match(/\/\*(\*(?!\/)|[^*])*\*\//g);
                    const comment = comments == null ? undefined : comments[comments.length - 1];
                    const formatted_comment = Object.
                        entries(comment_formatting).
                        reduce((formatted, [from, to]) => formatted?.split(from).join(to), comment);

                    return {
                        function_name,
                        comment: formatted_comment,
                        guts: { output, params },
                    };
                } catch (e) { console.error(e); }
            }).
            filter((statement): statement is {
                function_name: string;
                comment: string | undefined;
                guts: {
                    output: string;
                    params: {
                        [key: string]: {
                            type: string;
                            index: number;
                        };
                    };
                };
            } => statement != null);
        return `{\n${statements.map(statement =>
            `${statement.comment
            }\n${statement.function_name}: ${JSON.stringify(statement.guts, undefined, 4)
            }`).join(",\n")}\n}`;
    })();

    const text_areas = Object.values(HtmlBuilder.create_children(container, {
        original: {
            type: "textarea",
            attributes: { innerHTML: text },
            style,
        },
        processed: {
            type: "textarea",
            attributes: { innerHTML: processed },
            style,
        }
    }));

    const initial_scroll = Number.parseInt(localStorage.getItem("scroll") || "0");
    text_areas.forEach(text_area => {
        text_area.onscroll = (e) => {
            localStorage.setItem("scroll", `${text_areas[1].scrollTop}`);
        };
    });
    text_areas[1].scrollTop = initial_scroll;
}

display_parser();