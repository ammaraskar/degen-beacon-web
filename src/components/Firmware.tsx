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

export function Firmware({ rpc, deviceInfo }: { rpc: RpcInterface, deviceInfo: DeviceInformation }) {
    rpc; // TODO: use rpc here to actually upload firmware

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
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

            {/* Upload Form */}
            <Card elevation={2}>
                <CardContent>
                    <Typography variant="h6" sx={{ marginBottom: '1em' }}>
                        Upload New Firmware
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