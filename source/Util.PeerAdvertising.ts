import * as http from "http";

/**
 * 🌍 Single location to advertise peer nodes and have nodes learn about each other.
 * Requires some authentication to ensure that bad actors can't know about peers.
 * This server should be publically available at an easily memorable URL for access from peer nodes.
 * Hopefully, this SHOULD be the only server cost to maintain,
 * since all other nodes can be run from offices, homes and cellphones.
 */
export namespace PeerAdvertising {

    export const private_key = "coast.rip.scope.decay.peach"; // 👷 Change this for actual distribution
    export const hearbeat_rate_ms = 30000;

    export type PeerRole = "storage" | "web" | "neural"; // ☁ Dream big

    export type Peer = {
        readonly identifier: string,
        readonly role: PeerRole,
        readonly address: string,
        readonly timestamp: number,
    };

    /**
     *  Remove existing registration for identifier and add new one
     */
    export type RegisterHeartbeat = Peer & {
        readonly private_key: typeof private_key,
        readonly type: "register_heartbeat",
    };

    /**
     *  Remove peer for identifier
     */
    export type Unregister = {
        readonly private_key: typeof private_key,
        readonly type: "unregister",
        readonly identifier: string,
    };

    /**
     *  Present all current peers that haven't timed-out
     */
    export type ListPeers = {
        readonly private_key: typeof private_key,
        readonly type: "list_peers",
    };

    export type Unsafe = {
        readonly private_key: string | number | null,
    }

    export type Command = 
        | RegisterHeartbeat
        | Unregister
        | ListPeers
        | Unsafe;

    export type Response = "success" | {
        readonly peers: readonly Peer[]
    }

    export function start_server() {

        let peers: readonly Peer[] = [];

        http.createServer(async (req, res) => {

            // 👂 Get command from http request
            const command = await new Promise(async (resolve: (result: Command | null) => void) => {
                var body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    resolve(JSON.parse(body));
                });
                setTimeout(() => {
                    resolve(null);
                  }, 10000)
            });

            // 🛑 No valid command entered!
            if (command == null ||
                !("type" in command) ||
                command.private_key != private_key
            ) {
                res.end("code: SQUAT");
                return;
            }

            // ✨ Respond to command
            switch (command.type) {
                case "list_peers":
                    peers = peers.filter(peer =>
                        Date.now() - peer.timestamp < hearbeat_rate_ms * 2);
                    res.end(JSON.stringify(peers));
                    break;
                case "register_heartbeat":
                    peers = [
                        ...peers.filter(peer =>
                            peer.identifier != command.identifier),
                        {
                            address: command.address,
                            identifier: command.identifier,
                            role: command.role,
                            timestamp: Date.now(),
                        }
                    ]
                    break;
                case "unregister":
                    peers = peers.filter(peer =>
                        peer.identifier != command.identifier);
                    break;
            }

        }).listen(9615);
    }
}