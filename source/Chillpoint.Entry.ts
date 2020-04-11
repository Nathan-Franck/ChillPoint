import { HtmlBuilder } from './Util.HtmlBuilder';

export namespace ChillpointEntry {
    export function initializeClient() {
        console.log("hey! we're in!");
        HtmlBuilder.createChild(document.body, {
            type: "div",
            style: {
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