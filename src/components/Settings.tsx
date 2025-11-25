import React, { useEffect, useState, type JSX } from "react";
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
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { ConfigTypes } from "../beacon-rpc/ConfigValue";
import type { ConfigurableEnumConfigValue, ConfigurableIntegerConfigValue, ConfigurableFloatConfigValue } from "../beacon-rpc/ConfigValue";
import NumberSpinner from "./ext/NumberSpinner";

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
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState<string | number | boolean>('');

    let displayValue: string;
    let isConfigurable = false;
    let configType: number | null = null;

    if (typeof setting === 'string' || typeof setting === 'number' || typeof setting === 'boolean') {
        displayValue = String(setting);
    } else {
        // ConfigValue
        displayValue = String(setting.cfgVal);
        isConfigurable = setting.cfgType >= ConfigTypes.CONFIGURABLE_BOOLEAN;
        configType = setting.cfgType;

        // For enums, show the friendly label instead of the numeric value
        if (setting.cfgType === ConfigTypes.CONFIGURABLE_ENUM) {
            const enumSetting = setting as ConfigurableEnumConfigValue;
            const valueIndex = enumSetting.vals.indexOf(enumSetting.cfgVal as number);
            displayValue = enumSetting.valTxt[valueIndex];
        }
    }

    const handleEdit = () => {
        if (typeof setting === 'object' && 'cfgVal' in setting) {
            const val = setting.cfgVal;
            if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                setEditValue(val);
            }
        }
        setIsEditing(true);
    };

    const handleSave = () => {
        // TODO: Call RPC to save the value
        console.log('Saving', name, editValue);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const renderEditInput = () => {
        if (!(setting instanceof Object) || !('cfgType' in setting)) return null;

        switch (setting.cfgType) {
            case ConfigTypes.CONFIGURABLE_BOOLEAN:
                return (
                    <FormControlLabel
                        control={
                            <Switch
                                checked={Boolean(editValue)}
                                onChange={(e) => setEditValue(e.target.checked)}
                                color="primary"
                            />
                        }
                        label={String(editValue)}
                    />
                );

            case ConfigTypes.CONFIGURABLE_INTEGER:
                return (
                    <NumberSpinner
                        value={editValue as number}
                        onValueChange={(value) => setEditValue(value ?? 0)}
                        min={setting.minVal}
                        max={setting.maxVal}
                        step={setting.incVal}
                        size="small"
                    />
                );

            case ConfigTypes.CONFIGURABLE_FLOAT:
                return (
                    <NumberSpinner
                        value={editValue as number}
                        onValueChange={(value) => setEditValue(value ?? 0)}
                        min={setting.minVal}
                        max={setting.maxVal}
                        step={setting.incVal}
                        size="small"
                    />
                );

            case ConfigTypes.CONFIGURABLE_STRING:
                return (
                    <TextField
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        size="small"
                        fullWidth
                    />
                );

            case ConfigTypes.CONFIGURABLE_ENUM:
                if (typeof setting === 'object' && 'vals' in setting && 'valTxt' in setting) {
                    const enumSetting = setting as ConfigurableEnumConfigValue;
                    return (
                        <FormControl fullWidth size="small">
                            <Select
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value as number)}
                            >
                                {enumSetting.vals.map((val, idx) => (
                                    <MenuItem key={val} value={val}>
                                        {enumSetting.valTxt[idx]} ({val})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    );
                }
                return null;

            default:
                return null;
        }
    };

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
                        {isEditing ? (
                            <Box sx={{ marginTop: '0.5em' }}>
                                {renderEditInput()}
                            </Box>
                        ) : (
                            <Typography
                                variant="body1"
                                sx={{
                                    fontFamily: 'monospace',
                                }}
                            >
                                {displayValue}
                            </Typography>
                        )}
                    </Box>
                    {isConfigurable && (
                        <Stack direction="row" spacing={1} alignItems="center">
                            {isEditing ? (
                                <>
                                    <IconButton
                                        size="small"
                                        color="success"
                                        aria-label="save setting"
                                        onClick={handleSave}
                                        sx={{
                                            backgroundColor: 'action.hover',
                                            '&:hover': {
                                                backgroundColor: 'action.selected'
                                            }
                                        }}
                                    >
                                        <CheckIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        aria-label="cancel editing"
                                        onClick={handleCancel}
                                        sx={{
                                            backgroundColor: 'action.hover',
                                            '&:hover': {
                                                backgroundColor: 'action.selected'
                                            }
                                        }}
                                    >
                                        <CloseIcon fontSize="small" />
                                    </IconButton>
                                </>
                            ) : (
                                <IconButton
                                    size="small"
                                    color="primary"
                                    aria-label="edit setting"
                                    onClick={handleEdit}
                                    sx={{
                                        backgroundColor: 'action.hover',
                                        '&:hover': {
                                            backgroundColor: 'action.selected'
                                        }
                                    }}
                                >
                                    <EditIcon fontSize="small" />
                                </IconButton>
                            )}
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}