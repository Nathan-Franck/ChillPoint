import * as http from "http";

import { PeerAdvertising } from "./Util.PeerAdvertising";

export function start_peer_advertising_server() {

    let available_peers: readonly PeerAdvertising.AvailablePeer[] = [];

    http.createServer(async (request, response) => {

        // 👂 Get command from http request
        const command = await new Promise(async (resolve: (result: PeerAdvertising.Command | null) => void) => {
            var body: Buffer[] = [];
            request.on('data', chunk =>
                body.push(chunk));
            request.on('end', () => {
                const bodyJSON = Buffer.concat(body).toString();
                try {
                    resolve(JSON.parse(bodyJSON));
                } catch {
                    resolve(null);
                }
            });
            setTimeout(() => {
                resolve(null);
                }, 10000)
        });

        const send_response = (response_contents: PeerAdvertising.Response) => {
            response.writeHead(200, {
                'Content-Type': "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
            });
            const response_string = JSON.stringify(response_contents);
            response.end(response_string);
        };

        // 📫 Get remote address/port
        const { remoteAddress, remotePort } = request.connection;
        if (remoteAddress == null ||
            remotePort == null
        ) {
            send_response({ error: "code: HANDY" });
            return;
        }

        // 🛑 No valid command entered!
        if (command == null ||
            !("type" in command) ||
            command.private_key != PeerAdvertising.private_key
        ) {
            send_response({ error: "code: SQUAT"});
            return;
        }

        // ✨ Respond to command
        switch (command.type) {
            case "available_peers":
                available_peers = available_peers.filter(peer =>
                    Date.now() - peer.timestamp < PeerAdvertising.hearbeat_rate_ms * 2);
                send_response({ available_peers });
                break;
            case "register_heartbeat":
                available_peers = [
                    ...available_peers.filter(peer =>
                        peer.identifier != command.identifier),
                    <PeerAdvertising.AvailablePeer>{
                        address: remoteAddress,
                        port: remotePort,
                        identifier: command.identifier,
                        role: command.role,
                        timestamp: Date.now(),
                    }
                ];
                send_response({ success: true });
                break;
            case "unregister":
                available_peers = available_peers.filter(peer =>
                    peer.identifier != command.identifier);
                send_response({ success: true });
                break;
        }

    }).listen(PeerAdvertising.public_port);

    console.log("Started peer advertising server!");
}

start_peer_advertising_server();