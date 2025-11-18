import type { DeviceInformation } from "./RpcInterface";
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
}


export default HttpRPC;