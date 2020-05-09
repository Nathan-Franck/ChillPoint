import { HtmlBuilder } from './Util.HtmlBuilder';
import { ChillpointStyles as Styles } from './Chillpoint.Styles';
import { Terrain } from './Util.Terrain';
import { Camera } from './Util.Camera';
import { Meeples } from './Util.Meeples';

export namespace ChillpointEntry {
    export function initializeClient() {
        const body = HtmlBuilder.assignToElement(document.body, {
            style: {
                margin: 0,
                fontSize: 20,
                position: "relative",
                overflowX: "hidden",
                overflowY: "hidden",
            },
        });

        // Terrain.render(body, Camera.default_camera, 32);
        Meeples.render(body, Camera.default_camera);
        
        const uiOutline = HtmlBuilder.createChild(body, {
            type: "div",
            style: {
                width: "100%",
                height: "100%",
                position: "absolute",
                left: 0,
                top: 0,
                gridTemplateAreas: `
                    "t t t"
                    ". a ."
                    "f f f"
                `,
                zIndex: 1,
            },
        });

        const header = HtmlBuilder.createChild(uiOutline, {
            type: "div",
            style: {
                gridArea: "h",
                gridTemplateAreas: `
                    "t ."
                `,
                
                ...Styles.centered,

                backgroundColor: "green",
                borderRadius: "5px",
                padding: "0.5em",
            },
        });
        HtmlBuilder.createChild(header, {
            type: "div",
            style: {
                ...Styles.text,
                gridArea: "t",
            },
            attributes: {
                innerHTML: "chill_point",
            },
        });

        const footer = HtmlBuilder.createChild(uiOutline, {
            type: "div",
            style: {
                gridArea: "f",
                gridTemplateAreas: `
                    "w c s"
                `
            },
        });

        const warning = HtmlBuilder.createChild(uiOutline, {
            type: "div",
            style: {
                gridArea: "w",
            },
        });

        const app = HtmlBuilder.createChild(uiOutline, {
            type: "div",
            style: {
                gridArea: "a",
            },
        });

        const socials = HtmlBuilder.createChild(uiOutline, {
            type: "div",
            style: {
                gridArea: "s",
            },
        });
    }
}

// 👇 Client entry point
ChillpointEntry.initializeClient();