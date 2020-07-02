import { BspMap } from './base';
import {
  BspHsmType,
  BspStateType
} from './hsmTypes';
// import { DmMediaState } from '@brightsign/bsdatamodel';
import { LUT } from './base';

export type BspHsmMap = BspMap<BspHsm>;
export type BspHStateMap = BspMap<BspHState>;

export interface BspHsm {
  id: string;
  name: string;
  type: BspHsmType;
  topStateId: string;
  activeStateId: string | null;
  initialized: boolean;
  hsmData?: HsmData;
}

export type HsmData = ZoneHsmData | MediaZoneHsmData;

export interface ZoneHsmData {
  zoneId: string;
  x: number;
  y: number;
  width: number;
  height: number;

  initialMediaStateId: string;

  // mediaStateIds?
}

export interface MediaZoneHsmData extends ZoneHsmData {
  mediaStateIdToHState: LUT;
}

export interface BspHState {
  id: string;
  type: BspStateType;
  hsmId: string;
  superStateId: string;
  hStateData?: HStateData;
}
export type HStateData = MediaHStateData;

export interface MediaHStateData {
  timeout: any;
}

export interface MediaHState extends BspHState {
  // mediaState: DmMediaState;
  mediaStateId: string;
}

export interface HSMStateData {
  nextStateId: string | null;
}

export interface BspHsmState {
  hsmById: BspHsmMap;
  hStateById: BspHStateMap;
  activeHStateByHsm: BspHStateMap;
}
