import type { ConfigValue } from "./ConfigValue";

export type DeviceInformation = {
    DeviceName: string;
    DeviceID: number;
    FirmwareVersion: string;
    HardwareVersion: number;
}

export type SavedMessagesResponse = {
    Messages: string[];
}

export type Location = {
    Name: string;
    Lat: number;
    Lon: number;
}

export type SavedLocationsResponse = {
    Locations: Location[];
}

export type GetSettingsResponse = {
    [key: string]: number | string | boolean | ConfigValue;
}


export default interface RpcInterface {
    getDeviceInformation(): Promise<DeviceInformation>;
    getSavedMessages(): Promise<SavedMessagesResponse>;
    getSavedLocations(): Promise<SavedLocationsResponse>;
    getSettings(): Promise<GetSettingsResponse>;
}
