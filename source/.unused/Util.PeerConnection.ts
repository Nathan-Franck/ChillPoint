export namespace PeerConnection {


    function errorHandler(context: string) {
        return function (error: Error) {
            console.log('Failure in ' + context + ': ' + error.toString);
        };
    }

    // eslint-disable-next-line no-unused-vars
    function successHandler(context: string) {
        return function () {
            console.log('Success in ' + context);
        };
    }

    function noAction() {
    }

    export async function example() {
        console.log("🏃 Gonna do it");
        let servers = null;
        let pc1 = new RTCPeerConnection();
        let pc2 = new RTCPeerConnection();

        pc1.onicecandidate = function (event) {
            if (event.candidate) {
                pc2.addIceCandidate(new RTCIceCandidate(event.candidate));
                console.log("pc1");
            }
        };
        pc2.onicecandidate = function (event) {
            if (event.candidate) {
                pc1.addIceCandidate(new RTCIceCandidate(event.candidate));
                console.log("pc2");
            }
        };
        const desc = await pc1.createOffer();
        pc1.setLocalDescription(desc);
        pc2.setRemoteDescription(desc);
        const desc2 = await pc2.createAnswer();
        pc2.setLocalDescription(desc2);
        pc1.setRemoteDescription(desc2);
        console.log("Did all that 👍");
    }
}