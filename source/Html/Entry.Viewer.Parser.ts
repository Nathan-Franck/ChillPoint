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
    };

    const text_areas = Object.values(HtmlBuilder.create_children(container, {
        original: {
            type: "textarea",
            attributes: { innerHTML: text },
            style,
        },
        processed: {
            type: "textarea",
            attributes: { innerHTML: text },
            style,
        }
    }));

    const initial_scroll = Number.parseInt(localStorage.getItem("scroll") || "0");
    text_areas.forEach(text_area => {
        text_area.scrollTop = initial_scroll;
        text_area.onscroll = () => {
            text_areas.
                filter(other_area => other_area != text_area).
                forEach(other_area => other_area.scrollTop = text_area.scrollTop);
            localStorage.setItem("scroll", `${text_area.scrollTop}`);
        };
    });
}

display_parser();