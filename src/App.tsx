import PWABadge from './PWABadge.tsx'
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import React from 'react';
import type BeaconState from './BeaconState.tsx';
import ConnectCard from './ConnectCard.tsx';
import Typography from '@mui/material/Typography';


function App() {
  const [beacon, setBeacon] = React.useState<BeaconState>({ connected: false });

  return (
    <>
      <CssBaseline />
      {!beacon.connected && <ConnectCard setBeacon={setBeacon} />}
      {beacon.connected && <DeviceMenu beacon={beacon} />}
      <PWABadge />
    </>
  )
}

function DeviceMenu({ beacon }: { beacon: BeaconState }) {
  return (
    <Box sx={{ padding: '1em' }}>
      <Typography color="text.secondary" component="h1" variant="h4">
        Device Menu
      </Typography>
      <Typography sx={{ marginTop: '1em' }}>
        Connected to device: {beacon.initialDeviceInformation?.DeviceName} (ID: {beacon.initialDeviceInformation?.DeviceID})
        Firmware: {beacon.initialDeviceInformation?.FirmwareVersion}, Hardware: {beacon.initialDeviceInformation?.HardwareVersion}
      </Typography>
    </Box>
  )
}

export default App
