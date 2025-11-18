import type RpcInterface from './beacon-rpc/RpcInterface.tsx';
import type { DeviceInformation } from './beacon-rpc/RpcInterface.tsx';


export default interface BeaconState {
  connected: boolean;
  rpc?: RpcInterface;
  initialDeviceInformation?: DeviceInformation;
}
