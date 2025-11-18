import Card from '@mui/material/Card';
import Bluetooth from '@mui/icons-material/Bluetooth';
import NetworkWifi from '@mui/icons-material/NetworkWifi';
import React from 'react';

import HttpRPC from './beacon-rpc/HttpRPC.tsx';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Button from '@mui/material/Button';
import FormGroup from '@mui/material/FormGroup';
import Step from '@mui/material/Step';
import StepContent from '@mui/material/StepContent';
import StepLabel from '@mui/material/StepLabel';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import type BeaconState from './BeaconState.tsx';


export default function ConnectCard({ setBeacon }: { setBeacon: React.Dispatch<React.SetStateAction<BeaconState>> }) {
  const [activeStep, setActiveStep] = React.useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleConnect = () => {
    setConnectButtonLoading(true);

    const rpc = new HttpRPC(ipAddress);
    rpc.getDeviceInformation().then((info) => {
      console.log('Connected to device:', info);
      setBeacon({ connected: true, rpc, initialDeviceInformation: info });
    });
  };

  const [ipAddress, setIpAddress] = React.useState('');
  const handleIpAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIpAddress(event.target.value);
  }

  const [connectButtonLoading, setConnectButtonLoading] = React.useState(false);

  return (
    <Card sx={{ padding: '1em', minWidth: '300px', maxWidth: '600px' }}>
      <CardHeader title={
        <Typography color="text.secondary" component="h1" variant="h4">
          Connect Beacon
        </Typography>
      } />
      <CardContent>

        <Box textAlign='left' sx={{ maxWidth: 400 }}>
          <Stepper activeStep={activeStep} orientation="vertical">
            <Step key="Connection Method">
              <StepLabel>Connection Method</StepLabel>
              <StepContent>
                <Typography>Choose which way you would like to connect to your beacon.</Typography>

                <Box sx={{ mb: 2 }}>
                  <Button onClick={handleNext} sx={{ mt: 1, mr: 1 }} startIcon={<NetworkWifi />} variant='contained'>WiFi</Button>
                  <Tooltip arrow title="Bluetooth connection is currently in development.">
                    <span>
                      <Button sx={{ mt: 1, mr: 1 }} startIcon={<Bluetooth />} disabled variant='contained'>Bluetooth</Button>
                    </span>
                  </Tooltip>
                </Box>
              </StepContent>
            </Step>
            <Step key="Connect">
              <StepLabel>Connect with WiFi</StepLabel>
              <StepContent>
                <Typography>
                  Select <b>Pair with Terminal</b> on your beacon to see its IP Address.
                </Typography>
                <Typography variant='body2'>
                  Make sure it's on the same Network as this device.
                </Typography>

                <FormGroup sx={{ mt: 4 }}>
                  <TextField value={ipAddress} onChange={handleIpAddressChange} sx={{ mt: 1, mb: 1 }} label="Beacon IP Address" variant="outlined" />
                  <Box sx={{ mb: 2 }}>
                    <Button onClick={handleBack} sx={{ mt: 1, mr: 1 }}>Back</Button>
                    <Button onClick={handleConnect} sx={{ mt: 1, mr: 1 }} variant='contained' loading={connectButtonLoading}>Connect</Button>
                  </Box>
                </FormGroup>
              </StepContent>
            </Step>
          </Stepper>
        </Box>

      </CardContent>
    </Card>
  )
}