import { HtmlBuilder } from './Util.HtmlBuilder';
import { ChillpointStyles as Styles } from './Chillpoint.Styles';

export namespace ChillpointEntry {

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