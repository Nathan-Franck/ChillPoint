import * as http from "http";
import * as fs from "fs";

/**
 * 🕊 Serves webpages/scripts/content out to HTTP clients
 */
export namespace WebServer {
    export function start_server() {

        const file_content_map = {
            "html": "text/html",
            "css": "text/css",
            "js": "application/javascript",
            "ts": "application/javascript",
            "ttf": "application/x-font-truetype",
            "jpg": "image/jpeg",
            "map": "application/json",
            "": undefined,
        } as const;

        http.createServer(async (req, res) => {

            // 🌍 Process URL for file retrieval fromd local server storage
            const incoming_url = req.url?.split("?")[0] ?? "/";
            const file_path = incoming_url != "/" ? incoming_url : "/index.html";

            // 📚 Determine the file type to indicate in the result
            const  file_type = file_path.split(".").slice(-1)[0] as keyof typeof file_content_map;
            const content_type = file_content_map[file_type];

            // 🛑 Quit early if file type isn't yet supported
            if (content_type == undefined) {
                console.log();
                console.log(`file not supported: ${file_path}`);
                res.end(null);
                return;
            }

            // 🏌 Load and send the requested file back to the client
            const file: Buffer | null = await new Promise((resolve) =>
                fs.readFile(`${process.cwd()}${file_path}`, (_, data) => resolve(data)));
            
            res.writeHead(200, {'Content-Type': content_type});
            res.end(file);

        }).listen(9615);
    }
}

WebServer.start_server();