export interface DeviceInformation {
    DeviceName: string;
    DeviceID: number;
    FirmwareVersion: string;
    HardwareVersion: number;
}

export default interface RpcInterface {
    getDeviceInformation(): Promise<DeviceInformation>;
}
