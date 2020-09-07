import * as Pako from "pako"
import * as JSZip from "jszip"

export namespace EyeSpy {
    export async function display_puzzle() {
        const assets = await fetch("./images/EyeSpyAssets.zip");
        const data = Pako.inflate(new Uint8Array(await assets.arrayBuffer()));
    }
}

EyeSpy.display_puzzle();