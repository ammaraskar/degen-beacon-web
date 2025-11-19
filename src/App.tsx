import PWABadge from './PWABadge.tsx'
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import React from 'react';
import type BeaconState from './BeaconState.tsx';
import ConnectCard from './ConnectCard.tsx';
import Typography from '@mui/material/Typography';
import type { DeviceInformation } from './beacon-rpc/RpcInterface.tsx';


function App() {
  const [beacon, setBeacon] = React.useState<BeaconState>({ connected: false });

  return (
    <>
      <CssBaseline />
      {!beacon.connected && <ConnectCard setBeacon={setBeacon} />}
      {beacon.connected && <DeviceMenu deviceInfo={beacon.initialDeviceInformation!} />}
      <PWABadge />
    </>
  )
}

function DeviceMenu({ deviceInfo }: { deviceInfo: DeviceInformation }) {
  return (
    <Box sx={{ padding: '1em' }}>
      <Typography color="text.secondary" component="h1" variant="h4">
        Device Menu
      </Typography>
      <Typography sx={{ marginTop: '1em' }}>
        Connected to device: {deviceInfo.DeviceName} (ID: {deviceInfo.DeviceID})
        Firmware: {deviceInfo.FirmwareVersion}, Hardware: {deviceInfo.HardwareVersion}

        {deviceInfo.HardwareVersion === 1 && (
            <img src='./v1-icon.png'></img>
        )}
        {deviceInfo.HardwareVersion === 2 && (
            <img src='./v2-icon.png'></img>
        )}
      </Typography>
    </Box>
  )
}

export default App
