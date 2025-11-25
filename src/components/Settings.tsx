import React, { useEffect, type JSX } from "react";
import type RpcInterface from "../beacon-rpc/RpcInterface";
import type { GetSettingsResponse, Setting } from "../beacon-rpc/RpcInterface";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
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
    let displayValue: string;
    let isConfigurable = false;

    if (typeof setting === 'string' || typeof setting === 'number' || typeof setting === 'boolean') {
        displayValue = String(setting);
    } else {
        // ConfigValue
        displayValue = String(setting.cfgVal);
        isConfigurable = setting.cfgType >= ConfigTypes.CONFIGURABLE_BOOLEAN;
    }

    return (
        <Card elevation={1} sx={{ backgroundColor: 'background.paper' }}>
            <CardContent sx={{ padding: '1em !important' }}>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                    <Box sx={{ flex: 1 }}>
                        <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ 
                                textTransform: 'uppercase', 
                            }}
                        >
                            {name}
                        </Typography>
                        <Typography 
                            variant="body1" 
                            sx={{
                                fontFamily: 'monospace',
                            }}
                        >
                            {displayValue}
                        </Typography>
                    </Box>
                    {isConfigurable && (
                        <Stack direction="row" spacing={1} alignItems="center">
                            <IconButton
                                size="small"
                                color="primary"
                                aria-label="edit setting"
                                sx={{
                                    backgroundColor: 'action.hover',
                                    '&:hover': {
                                        backgroundColor: 'action.selected'
                                    }
                                }}
                            >
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}