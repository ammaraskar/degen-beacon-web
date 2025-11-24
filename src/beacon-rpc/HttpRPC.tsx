import { decode, encode } from "@msgpack/msgpack";
import type { DeviceInformation, GetSettingsResponse, SavedLocationsResponse, SavedMessagesResponse } from "./RpcInterface";
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
        return (await this._sendMsgPackRpc('GetSavedMessages')) as SavedMessagesResponse;
    }

    async getSavedLocations(): Promise<SavedLocationsResponse> {
        return (await this._sendMsgPackRpc('GetSavedLocations')) as SavedLocationsResponse;
    }

    async getSettings(): Promise<GetSettingsResponse> {
        return (await this._sendMsgPackRpc('GetSettings')) as GetSettingsResponse;
    }

    async _sendMsgPackRpc(functionName: string, params: any = {}): Promise<any> {
        const body = {
            'F': functionName,
            ...params,
        };
        const response = await fetch(`http://${this.ipAddress}/rpc`, {
            method: 'POST',
            body: encodeMsgPack(body),
        });
        const responseData = await response.arrayBuffer();
        return decode(responseData);
    }
}

function encodeMsgPack(data: any): ArrayBuffer {
    const encoded = encode(data);
    return new Uint8Array(encoded).buffer;
}

export default HttpRPC;