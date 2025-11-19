import PWABadge from './components/PWABadge.tsx'
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import React from 'react';
import type BeaconState from './BeaconState.tsx';
import ConnectCard from './components/ConnectCard.tsx';
import { DeviceMenu } from './components/DeviceMenu.tsx';


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

export default App
