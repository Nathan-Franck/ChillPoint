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
                gridTemplateAreas: `
                a b
            `,
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr",
                gridGap: "1em",
            },
        }
    });

    const file = await fetch("SDL_video.h");
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

    // 🚧 Actual parsing work
    const processed = (() => {
        const externs = text.split("extern");
        const statements = externs.map((extern, index) => {
            const previous = index > 0 ? externs[index - 1] : "";
            const statement = extern.split(";")[0];
            return statement.split(`\r\n`).reduce((result, line) => `${result}${line.trim()}`);
        });
        return statements.reduce((processed, statement) => {
            return `${processed}\n\n${statement}`;
        }, "");
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
            text_areas.
                filter(other_area => other_area != text_area).
                forEach(other_area => {
                    const scroll = text_area.scrollTop *
                        (other_area.scrollHeight - other_area.clientHeight) /
                        (text_area.scrollHeight - text_area.clientHeight);
                    other_area.scrollTop = scroll
                });
            localStorage.setItem("scroll", `${text_areas[0].scrollTop}`);
        };
    });
    text_areas[0].scrollTop = initial_scroll;
}

display_parser();