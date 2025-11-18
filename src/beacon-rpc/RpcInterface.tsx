export interface DeviceInformation {
    DeviceName: string;
    DeviceID: number;
    FirmwareVersion: string;
    HardwareVersion: string;
}

export default interface RpcInterface {
    getDeviceInformation(): Promise<DeviceInformation>;
}
