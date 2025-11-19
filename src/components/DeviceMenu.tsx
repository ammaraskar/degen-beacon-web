import Box from "@mui/material/Box";
import type { DeviceInformation } from "../beacon-rpc/RpcInterface";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import React from "react";
import Settings from "@mui/icons-material/Settings";
import Container from "@mui/material/Container";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Message from "@mui/icons-material/Message";
import PinDrop from "@mui/icons-material/PinDrop";
import SystemUpdateAlt from "@mui/icons-material/SystemUpdateAlt";

export function DeviceMenu({ deviceInfo }: { deviceInfo: DeviceInformation }) {
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <DeviceInfoToolbar deviceInfo={deviceInfo} />

      <Container sx={{ maxWidth: '600px', mt: 2}}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab icon={<Message />} label="Messages" />
          <Tab icon={<PinDrop />} label="Locations" />
          <Tab icon={<Settings />} label="Settings" />
          <Tab icon={<SystemUpdateAlt />} label="Firmware" />
        </Tabs>
      </Container>
    </>
  )
}

function DeviceInfoToolbar({ deviceInfo }: { deviceInfo: DeviceInformation }) {
  return (
    <Box textAlign='center'>
      <Paper elevation={3}>
        <Stack
          direction="row"
          spacing={{ xs: 1, sm: 2 }}
          alignItems="center"
          justifyContent="center"
          sx={{
            padding: '1em 1.5em',
            flexWrap: 'wrap'
          }}
          useFlexGap
          divider={<Divider orientation="vertical" flexItem />}
        >
          {/* Device Icon */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {deviceInfo.HardwareVersion === 1 && (
              <img
                width={60}
                src='./v1-icon.png'
                alt="Hardware Version 1"
                style={{ display: 'block' }}
              />
            )}
            {deviceInfo.HardwareVersion === 2 && (
              <img
                width={60}
                src='./v2-icon.png'
                alt="Hardware Version 2"
                style={{ display: 'block' }}
              />
            )}
          </Box>

          {/* Device Name */}
          <Box sx={{ minWidth: '150px' }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600 }}>
              Device Name
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {deviceInfo.DeviceName}
            </Typography>
          </Box>

          {/* Device ID */}
          <Box sx={{ minWidth: '80px' }}>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600 }}>
              Device ID
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
              {deviceInfo.DeviceID}
            </Typography>
          </Box>

          {/* Version Information */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.3em', display: 'block' }}>
              Version Information
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip
                label={`Firmware: ${deviceInfo.FirmwareVersion}`}
                size="small"
                color="primary"
                variant="outlined"
              />
              <Chip
                label={`Hardware: v${deviceInfo.HardwareVersion}`}
                size="small"
                color="secondary"
                variant="outlined"
              />
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  )
}
