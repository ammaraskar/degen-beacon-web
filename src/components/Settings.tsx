import React, { useEffect, type JSX } from "react";
import type RpcInterface from "../beacon-rpc/RpcInterface";
import type { GetSettingsResponse, Setting } from "../beacon-rpc/RpcInterface";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { ConfigTypes } from "../beacon-rpc/ConfigValue";

export function Settings({ rpc }: { rpc: RpcInterface }) {
    const [settings, setSettings] = React.useState<GetSettingsResponse | null>(null);

    useEffect(() => {
        rpc.getSettings().then(response => {
            setSettings(response);
        });
    }, [rpc]);

    if (settings === null) {
        return <CircularProgress />;
    }

    return (
        <>
            <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Settings
            </Typography>

            <Stack direction="column" spacing={2}>
                {
                    [...Object.entries(settings)].map(([key, value]) =>
                        <SettingItem key={key} name={key} setting={value} />
                    )
                }
            </Stack>
        </>
    );
}

export function SettingItem({ name, setting }: { name: string, setting: Setting }): JSX.Element {
    if (typeof setting == 'string' || typeof setting == 'number' || typeof setting == 'boolean') {
        return (
            <Typography variant="body1">
                {name}: {setting}
            </Typography>
        );
    }
    // ConfigValue
    switch (setting.cfgType) {
        case ConfigTypes.NULL:
        case ConfigTypes.BOOLEAN:
        case ConfigTypes.INTEGER:
        case ConfigTypes.FLOAT:
        case ConfigTypes.STRING:
        case ConfigTypes.ARRAY:
        case ConfigTypes.OBJECT:
            return (
                <Typography variant="body1">
                    {name}: {String(setting.cfgVal)}
                </Typography>
            );
        case ConfigTypes.CONFIGURABLE_BOOLEAN:
        case ConfigTypes.CONFIGURABLE_INTEGER:
        case ConfigTypes.CONFIGURABLE_FLOAT:
        case ConfigTypes.CONFIGURABLE_STRING:
            return (
                <Typography variant="body1">
                    {name}: {String(setting.cfgVal)}
                </Typography>
            );
        case ConfigTypes.CONFIGURABLE_ENUM:
            return (
                <Typography variant="body1">
                    {name}: {String(setting.cfgVal)} (enum)
                </Typography>
            );
    }
}