import { HtmlBuilder, Style } from './Util.HtmlBuilder';

export namespace ChillpointEntry {

    export namespace Styles {
        export const centered: Style = {
            display: "grid",
            justifyItems: "center",
            alignItems: "center",
            textAlign: "center",
            fontFamily: "lato",
        };
    }

    export function initializeClient() {
        console.log("hey! we're in!");
        HtmlBuilder.createChild(document.body, {
            type: "div",
            style: {
                ...Styles.centered,

                backgroundColor: "green",
                width: "50",
                height: "50",
                borderRadius: "5px",
            },
            attributes: {
                innerHTML: "Chill Point",
            }
        });
    }
}

// 👇 Client entry point
ChillpointEntry.initializeClient();