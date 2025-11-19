import Box from "@mui/material/Box";
import type { DeviceInformation } from "../beacon-rpc/RpcInterface";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

export function DeviceMenu({ deviceInfo }: { deviceInfo: DeviceInformation }) {
  return (
    <Box sx={{ padding: '2em', maxWidth: '800px', margin: '0 auto' }}>
      <Typography 
        color="text.primary" 
        component="h1" 
        variant="h4" 
        sx={{ marginBottom: '1.5em', fontWeight: 600 }}
      >
        Device Information
      </Typography>
      
      <Card elevation={3}>
        <CardContent>
          <Stack spacing={3}>
            {/* Device Image */}
            <Box sx={{ display: 'flex', justifyContent: 'center', padding: '1em' }}>
              {deviceInfo.HardwareVersion === 1 && (
                <img 
                  width={200} 
                  src='./v1-icon.png' 
                  alt="Hardware Version 1"
                  style={{ borderRadius: '8px' }}
                />
              )}
              {deviceInfo.HardwareVersion === 2 && (
                <img 
                  width={200} 
                  src='./v2-icon.png' 
                  alt="Hardware Version 2"
                  style={{ borderRadius: '8px' }}
                />
              )}
            </Box>

            <Divider />

            {/* Device Name */}
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                Device Name
              </Typography>
              <Typography variant="h6" sx={{ marginTop: '0.25em' }}>
                {deviceInfo.DeviceName}
              </Typography>
            </Box>

            {/* Device ID */}
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600 }}>
                Device ID
              </Typography>
              <Typography variant="body1" sx={{ marginTop: '0.25em', fontFamily: 'monospace' }}>
                {deviceInfo.DeviceID}
              </Typography>
            </Box>

            <Divider />

            {/* Version Information */}
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, marginBottom: '0.5em', display: 'block' }}>
                Version Information
              </Typography>
              <Stack direction="row" spacing={1} sx={{ marginTop: '0.5em' }}>
                <Chip 
                  label={`Firmware: ${deviceInfo.FirmwareVersion}`} 
                  color="primary" 
                  variant="outlined"
                />
                <Chip 
                  label={`Hardware: v${deviceInfo.HardwareVersion}`} 
                  color="secondary" 
                  variant="outlined"
                />
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  )
}
