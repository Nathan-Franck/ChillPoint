import { app, BrowserWindow } from 'electron';
import * as path from 'path';

export namespace ElectronEntry {
    export function Start() {
        app.commandLine.appendSwitch('disable-frame-rate-limit');
        app.commandLine.appendSwitch('disable-gpu-vsync');
        app.on("ready", () => {
            app.on("window-all-closed", () => { });
            const args = process.argv as [executable: string, entry: string, renderer_entry: string];
            const renderer_entry = path.join(app.getAppPath(), args[2]);
            console.log(args);
            const window = new BrowserWindow({
                width: 1920,
                height: 1080,
                fullscreen: true,
                webPreferences: {
                    worldSafeExecuteJavaScript: true,
                    devTools: true,
                },
                backgroundColor: "#000",
            });
            window.loadFile(renderer_entry);
        });
    }
}

ElectronEntry.Start();