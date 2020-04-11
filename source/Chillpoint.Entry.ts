import { HtmlBuilder } from './Util.HtmlBuilder';

export namespace ChillpointEntry {
    export function initializeClient() {
        console.log("hey! we're in!");
        HtmlBuilder.createChild(document.body, {
            type: "div",
            style: {
                color: "green",
                width: "50",
                height: "50",
            },
            attributes: {
                innerHTML: "we're in boys",
            }
        });
    }
}

// 👇 Client entry point
ChillpointEntry.initializeClient();