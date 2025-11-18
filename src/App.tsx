import PWABadge from './PWABadge.tsx'
import './App.css'
import CssBaseline from '@mui/material/CssBaseline';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Button, CardContent, CardHeader, Tabs, TextField, Tooltip, Typography } from '@mui/material';
import Bluetooth from '@mui/icons-material/Bluetooth';
import NetworkWifi from '@mui/icons-material/NetworkWifi';

function App() {
  return (
    <>
      <CssBaseline />
      <ConnectCard />
      <PWABadge />
    </>
  )
}

function ConnectCard() {
  return (
      <Card sx={{ padding: '1em', minWidth: '300px', maxWidth: '600px' }} variant="outlined">
        <CardHeader title={
          <Typography component="h1" variant="h4">
            Connect Beacon
          </Typography>
        } />
        <CardContent>
          <Tabs>
            <Tab icon={<NetworkWifi />} label="WiFi" />
            <Tooltip placement="top" title="Bluetooth connection is not supported yet" arrow>
              <span>
                <Tab disabled icon={<Bluetooth />} label="Bluetooth" />
              </span>
            </Tooltip>
          </Tabs>

          <Typography align='left' sx={{margin: '1em'}} variant="body1" gutterBottom>
            Select <i>Pair with Terminal</i> on your beacon to grab its IP address.
            Make sure it's connected to the same WiFi network as this device.
          </Typography>
          <Box>
            <TextField size='small' id="outlined-basic" label="Beacon IP Address" variant="outlined" />
            <Button variant="contained" sx={{ marginLeft: '1em' }}>Connect</Button>
          </Box>

        </CardContent>
      </Card>
  )
}

export default App
