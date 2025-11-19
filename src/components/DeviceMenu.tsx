import Box from "@mui/material/Box";
import type { DeviceInformation } from "../beacon-rpc/RpcInterface";
import Typography from "@mui/material/Typography";

export function DeviceMenu({ deviceInfo }: { deviceInfo: DeviceInformation }) {
  return (
    <Box sx={{ padding: '1em' }}>
      <Typography color="text.secondary" component="h1" variant="h4">
        Device Menu
      </Typography>
      <Typography sx={{ marginTop: '1em' }}>
        Connected to device: {deviceInfo.DeviceName} (ID: {deviceInfo.DeviceID})
        Firmware: {deviceInfo.FirmwareVersion}, Hardware: {deviceInfo.HardwareVersion}

        {deviceInfo.HardwareVersion === 1 && (
            <img width={150} src='./v1-icon.png'></img>
        )}
        {deviceInfo.HardwareVersion === 2 && (
            <img width={150} src='./v2-icon.png'></img>
        )}
      </Typography>
    </Box>
  )
}
