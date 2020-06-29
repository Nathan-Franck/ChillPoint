/**
 * 🌍 Single location to advertise peer nodes and have nodes learn about each other.
 * Requires some authentication to ensure that bad actors can't know about peers.
 * This server should be publically available at an easily memorable URL for access from peer nodes.
 * Hopefully, this SHOULD be the only server cost to maintain,
 * since all other nodes can be run from offices, homes and cellphones.
 */
export namespace PeerAdvertising {

    export const public_address = "localhost";
    export const public_port = 6902;
    export const private_key = "coast.rip.scope.decay.peach"; // 👷 Change this for actual distribution
    export const hearbeat_rate_ms = 3000;

    export type PeerRole = "storage" | "web" | "neural"; // ☁ Dream big

    export type Peer = {
        readonly identifier: string,
        readonly role: PeerRole,
    };

    export type AvailablePeer = Peer & {
        readonly timestamp: number,
        readonly address: string,
        readonly port: number,
    };

    export namespace Commands {

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
        export type AvailablePeers = {
            readonly private_key: typeof private_key,
            readonly type: "available_peers",
        };

        export type Unsafe = {
            readonly private_key: string | number | null,
        }

    }

    export type Command = 
        | Commands.RegisterHeartbeat
        | Commands.Unregister
        | Commands.AvailablePeers
        | Commands.Unsafe;

    export type AvailablePeers = {
        readonly available_peers: readonly AvailablePeer[]
    };

    export type Response = AvailablePeers |  { success: true } | { error: string };

    export async function available_peers(): Promise<AvailablePeers | null> {
        const response = await command_server({
            private_key,
            type: "available_peers",
        });
        if ("error" in response ||
            "success" in response) {
            return null;
        }
        return response;
    }

    export function advertise_peer(peer: Peer) {
        return setInterval(async () => {
            const response = await command_server({
                private_key,
                type: "register_heartbeat",
                ...peer,
            });

            if (typeof response == "string") {
                console.log(response);
            }
        }, hearbeat_rate_ms);
    }

    async function command_server(command: Command) {
        const fetchResult = await fetch(`http://${public_address}:${public_port}`, {
            method: "POST",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(command),
        });
        const text = await fetchResult.text();
        const response: Response = text ? JSON.parse(text) : {};
        return response;
    }
}