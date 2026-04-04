/// <reference types="w3c-web-serial" />
/// RPC over web serial API

import type { DeviceInformation, SavedMessagesResponse, SavedLocationsResponse, GetSettingsResponse, DisplayContentsResponse } from "./RpcInterface";
import type RpcInterface from "./RpcInterface";

export async function connectToSerialDevice(): Promise<SerialRPC> {
    const port = await navigator.serial.requestPort();
    await port.open({ baudRate: 115200 });
    return new SerialRPC(port);
}

class SerialRPC implements RpcInterface {
    serial: SerialPort;
    writer: WritableStreamDefaultWriter<Uint8Array<ArrayBufferLike>>;
    reader: ReadableStreamDefaultReader<string>;

    constructor(serial: SerialPort) {
        this.serial = serial;

        if (!this.serial.readable) {
            throw new Error("Serial port not readable");
        }
        const textDecoder = new TextDecoderStream();
        this.serial.readable.pipeTo(textDecoder.writable as WritableStream<Uint8Array<ArrayBuffer>>);
        this.reader = textDecoder.readable
            .pipeThrough(new TransformStream(new LineBreakTransformer()))
            .getReader();

        if (!this.serial.writable) {
            throw new Error("Serial port not writable");
        }
        this.writer = this.serial.writable.getWriter();
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

    async getDisplayContents(): Promise<DisplayContentsResponse> {
        return (await this._performRpcCall('GetDisplayContents'));
    }

    async _performRpcCall(functionName: string, params: any = {}): Promise<any> {
        const body = {
            'F': functionName,
            ...params,
        };
        const data = "RPC-->" + JSON.stringify(body) + "\n";

        const encoder = new TextEncoder();
        await this.writer.write(encoder.encode(data));

        while (true) {
            const data = (await this.reader.read()).value;
            console.log("Read " + data);

            if (data?.startsWith("RPC<--")) {
                const res = JSON.parse(data?.replace("RPC<--", ""));
                return res;
            }
        }
    }
}

class LineBreakTransformer implements Transformer<string, string> {
  chunks: string = "";

  transform(chunk: string, controller: TransformStreamDefaultController<string>) {
    // Append new chunks to existing chunks.
    this.chunks += chunk;
    // For each line breaks in chunks, send the parsed lines out.
    const lines = this.chunks.split("\r\n");
    this.chunks = lines.pop() || "";
    lines.forEach((line) => controller.enqueue(line));
  }

  flush(controller: TransformStreamDefaultController<string>) {
    // When the stream is closed, flush any remaining chunks out.
    controller.enqueue(this.chunks);
  }
}
