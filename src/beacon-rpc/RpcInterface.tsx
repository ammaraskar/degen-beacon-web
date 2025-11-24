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

export type SavedLocation = {
    Name: string;
    Lat: number;
    Lng: number;
}

export type SavedLocationsResponse = {
    Locations: SavedLocation[];
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
