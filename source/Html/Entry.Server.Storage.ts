import * as http from "http";
import * as fs from "fs";
import { Certificate } from "crypto";

/**
 * 💽 Stores persistant data from applications on the local harddrive
 */
export namespace Storage {
        type RestMethod = 
            | "GET"
            | "PUT"
            | "POST"
            | "PATCH"
            | "DELETE";
        export function start() {
            http.createServer(async (req, res) => {
                const method = req.method as RestMethod; // 👷 Respond differently depending on REST method used
            });
        }
}

Storage.start();