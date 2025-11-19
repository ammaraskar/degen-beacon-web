import { decode, encode } from "@msgpack/msgpack";
import type { DeviceInformation, SavedMessagesResponse } from "./RpcInterface";
import type RpcInterface from "./RpcInterface";

class HttpRPC implements RpcInterface {
    ipAddress: string;

    constructor(ipAddress: string) {
        this.ipAddress = ipAddress;
    }

    async getDeviceInformation(): Promise<DeviceInformation> {
        const response = await fetch(`http://${this.ipAddress}/`);
        return response.json();
    }

    async getSavedMessages(): Promise<SavedMessagesResponse> {
        const body = {
            'F': 'GetSavedMessages',
        };

        const response = await fetch(`http://${this.ipAddress}/rpc`, {
            method: 'POST',
            body: encodeMsgPack(body),
        });
        const responseData = await response.arrayBuffer();
        return decode(responseData) as SavedMessagesResponse;
    }
}

function encodeMsgPack(data: any): ArrayBuffer {
    const encoded = encode(data);
    return new Uint8Array(encoded).buffer;
}

export default HttpRPC;