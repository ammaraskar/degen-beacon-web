import { useState } from "react";
import type { DeviceInformation } from "../beacon-rpc/RpcInterface";
import type RpcInterface from "../beacon-rpc/RpcInterface";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import MemoryIcon from "@mui/icons-material/Memory";

// Static firmware list - will be fetched from server later
const AVAILABLE_FIRMWARE = [
    { version: '3.0.3.0', date: '2025-11-24', description: 'Latest stable release with bug fixes', hwVersion: 1 },
    { version: '3.0.2.96', date: '2025-11-20', description: 'Current version', hwVersion: 1 },
    { version: '3.0.2.95', date: '2025-11-15', description: 'Previous stable release', hwVersion: 1 },
    { version: '2.5.1.0', date: '2025-10-30', description: 'Legacy version for v2 hardware', hwVersion: 2 },
];

export function Firmware({ rpc, deviceInfo }: { rpc: RpcInterface, deviceInfo: DeviceInformation }) {
    rpc; // TODO: use rpc here to actually upload firmware

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedFirmware, setSelectedFirmware] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setMessage(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        setUploadProgress(0);
        setMessage({ type: 'info', text: 'Starting firmware upload...' });

        try {
            // TODO: Implement actual firmware upload using rpc
            // Simulate upload progress
            for (let i = 0; i <= 100; i += 10) {
                setUploadProgress(i);
                await new Promise(resolve => setTimeout(resolve, 200));
            }

            setMessage({ type: 'success', text: 'Firmware uploaded successfully! Device will restart.' });
            setSelectedFile(null);
        } catch (error) {
            setMessage({ type: 'error', text: `Upload failed: ${error}` });
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ padding: '2em', maxWidth: '800px', margin: '0 auto' }}>
            <Typography variant="h5" sx={{ marginBottom: '1.5em', fontWeight: 600 }}>
                Firmware Management
            </Typography>

            {/* Current Firmware Info */}
            <Card elevation={2} sx={{ marginBottom: '2em' }}>
                <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <MemoryIcon color="primary" sx={{ fontSize: 40 }} />
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                                Current Firmware
                            </Typography>
                            <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                                {deviceInfo.FirmwareVersion}
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <Chip label={`Hardware v${deviceInfo.HardwareVersion}`} color="secondary" variant="outlined" />
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            {/* Available Firmware */}
            <Card elevation={2} sx={{ marginBottom: '2em' }}>
                <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: '1em' }}>
                        Available Firmware
                    </Typography>
                    
                    <Stack spacing={1}>
                        {AVAILABLE_FIRMWARE.filter(fw => fw.hwVersion === deviceInfo.HardwareVersion).map((firmware) => (
                            <Card 
                                key={firmware.version}
                                variant="outlined"
                                sx={{ 
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    border: selectedFirmware === firmware.version ? '2px solid' : '1px solid',
                                    borderColor: selectedFirmware === firmware.version ? 'primary.main' : 'divider',
                                    backgroundColor: selectedFirmware === firmware.version ? 'action.selected' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                        borderColor: 'primary.light'
                                    }
                                }}
                                onClick={() => setSelectedFirmware(firmware.version)}
                            >
                                <CardContent sx={{ padding: '1em !important' }}>
                                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
                                        <Box>
                                            <Typography variant="h6" sx={{ fontFamily: 'monospace', marginBottom: '0.25em' }}>
                                                {firmware.version}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {firmware.description}
                                            </Typography>
                                        </Box>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Chip label={firmware.date} size="small" variant="outlined" />
                                            {firmware.version === deviceInfo.FirmwareVersion && (
                                                <Chip label="Current" size="small" color="success" />
                                            )}
                                        </Stack>
                                    </Stack>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>

                    {selectedFirmware && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                // TODO: Download and install selected firmware
                                setMessage({ type: 'info', text: `Installing firmware ${selectedFirmware}...` });
                            }}
                            disabled={uploading || selectedFirmware === deviceInfo.FirmwareVersion}
                            fullWidth
                            sx={{ marginTop: '1em' }}
                        >
                            Install Selected Firmware
                        </Button>
                    )}
                </CardContent>
            </Card>

            {/* Upload Form */}
            <Card elevation={2}>
                <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: '1em' }}>
                        Upload Custom Firmware
                    </Typography>

                    {message && (
                        <Alert severity={message.type} sx={{ marginBottom: '1em' }}>
                            {message.text}
                        </Alert>
                    )}

                    <Stack spacing={2}>
                        <Box>
                            <input
                                accept=".bin,.hex,.elf"
                                style={{ display: 'none' }}
                                id="firmware-file-input"
                                type="file"
                                onChange={handleFileSelect}
                                disabled={uploading}
                            />
                            <label htmlFor="firmware-file-input">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<UploadFileIcon />}
                                    disabled={uploading}
                                    fullWidth
                                >
                                    {selectedFile ? selectedFile.name : 'Select Firmware File'}
                                </Button>
                            </label>
                        </Box>

                        {selectedFile && (
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '0.5em' }}>
                                    File size: {(selectedFile.size / 1024).toFixed(2)} KB
                                </Typography>
                            </Box>
                        )}

                        {uploading && (
                            <Box>
                                <Typography variant="body2" color="text.secondary" sx={{ marginBottom: '0.5em' }}>
                                    Upload progress: {uploadProgress}%
                                </Typography>
                                <LinearProgress variant="determinate" value={uploadProgress} />
                            </Box>
                        )}

                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleUpload}
                            disabled={!selectedFile || uploading}
                            fullWidth
                        >
                            {uploading ? 'Uploading...' : 'Upload Firmware'}
                        </Button>

                        <Alert severity="warning">
                            <Typography variant="body2">
                                <strong>Warning:</strong> Ensure you select the correct firmware file for your hardware version.
                                Uploading incorrect firmware may brick your device.
                            </Typography>
                        </Alert>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}