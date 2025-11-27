/// <reference types="web-bluetooth" />
import { decode, encode } from "@msgpack/msgpack";
import type { DeviceInformation, GetSettingsResponse, SavedLocationsResponse, SavedMessagesResponse } from "./RpcInterface";
import type RpcInterface from "./RpcInterface";


const DEGEN_SERVICE_UUID = '033c3d34-8405-46db-8326-07169d5353a9';
const RPC_CHARACTERISTIC_UUID = '033c3d37-8405-46db-8326-07169d5353a9';


export async function connectToBluetoothDevice(): Promise<BluetoothRPC> {
    const device = await navigator.bluetooth.requestDevice({
        filters: [
            {namePrefix: 'DegenBeacon'},
        ],
        optionalServices: [DEGEN_SERVICE_UUID],
    });

    let gattServer = await device.gatt!.connect();
    let degenService = await gattServer.getPrimaryService(DEGEN_SERVICE_UUID);

    let rpcCharacteristic = await degenService.getCharacteristic(RPC_CHARACTERISTIC_UUID);
    console.log('Connected to Bluetooth device:', device, rpcCharacteristic);

    // Check if we are paired by trying to read the characteristic. If not, we
    // need to give the user some time to pair.
    try {
        await rpcCharacteristic.readValue();
    } catch (e) {
        console.error('Error reading RPC characteristic, waiting for pairing...', e);

        await new Promise(resolve => setTimeout(resolve, 100));

        gattServer = await device.gatt!.connect();
        degenService = await gattServer.getPrimaryService(DEGEN_SERVICE_UUID);
        rpcCharacteristic = await degenService.getCharacteristic(RPC_CHARACTERISTIC_UUID);

        // Wait either 30 seconds or until the window has focus again.
        async function waitForFocusOrTimeout() {
            if (document.hasFocus()) {
                await new Promise(resolve => setTimeout(resolve, 5_000));
            }

            for (let i = 0; i < 30; i++) {
                if (document.hasFocus()) {
                    return;
                }
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
        await waitForFocusOrTimeout();
    }

    return new BluetoothRPC(device, rpcCharacteristic);
};

const MAX_BLE_CHUNK_SIZE = 500;

class BluetoothRPC implements RpcInterface {
    device: BluetoothDevice;
    rpcCharacteristic: BluetoothRemoteGATTCharacteristic;

    constructor(device: BluetoothDevice, rpcCharacteristic: BluetoothRemoteGATTCharacteristic) {
        this.device = device;
        this.rpcCharacteristic = rpcCharacteristic;
    }

    async getDeviceInformation(): Promise<DeviceInformation> {
        return (await this._performRpcCall('GetSystemInfo')) as DeviceInformation;
    }

    async getSavedMessages(): Promise<SavedMessagesResponse> {
        return (await this._performRpcCall('GetSavedMessages')) as SavedMessagesResponse;
    }

    async getSavedLocations(): Promise<SavedLocationsResponse> {
        return (await this._performRpcCall('GetSavedLocations')) as SavedLocationsResponse;
    }

    async getSettings(): Promise<GetSettingsResponse> {
        return (await this._performRpcCall('GetSettings')) as GetSettingsResponse;
    }

    async _performRpcCall(functionName: string, params: any = {}): Promise<any> {
        const body = {
            'F': functionName,
            ...params,
        };
        const data = encode(body);

        // Send in chunks of MAX_BLE_CHUNK_SIZE, start a chunk with 1 if more
        // chunks are coming, 0 if it's the last chunk
        const chunks = [];
        for (let i = 0; i < data.byteLength; i += MAX_BLE_CHUNK_SIZE) {
            const chunk = data.slice(i, i + MAX_BLE_CHUNK_SIZE);
            chunks.push(chunk);
        }
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const chunkWithHeader = new Uint8Array(chunk.byteLength + 1);
            chunkWithHeader[0] = (i < chunks.length - 1) ? 1 : 0;
            chunkWithHeader.set(new Uint8Array(chunk), 1);

            await this.rpcCharacteristic.writeValueWithResponse(chunkWithHeader);
        }

        // Now read the response in chunks
        const dataChunks = [];
        while (true) {
            const value = await this.rpcCharacteristic.readValue();
            
            const moreChunks = value.getUint8(0) === 1;
            // Copy the data into our dataChunks.
            const data = new Uint8Array(value.byteLength - 1);
            data.set(new Uint8Array(value.buffer.slice(1)));

            dataChunks.push(data);
            console.log('More chunks:', moreChunks);
            if (!moreChunks) {
                break;
            }
        }
        const receivedData = new Blob(dataChunks);

        const responseData = await receivedData.arrayBuffer();
        console.log(responseData);
        return decode(new Uint8Array(responseData));
    }
}

export default BluetoothRPC;
