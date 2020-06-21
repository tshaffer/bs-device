import { BspMap } from './base';
import {
  BspHsmType,
  BspStateType
} from './hsmTypes';

export type BspHsmMap = BspMap<BspHsm>;
export type BspHStateMap = BspMap<BspHState>;

export interface BspHsm {
  id: string;
  type: BspHsmType;
  topStateId: string;
  activeStateId: string | null;
  initialized: boolean;
}

export interface BspHState {
  id: string;
  type: BspStateType;
  hsmId: string;
  superStateId: string;
}

export interface HSMStateData {
  nextStateId: string | null;
}

export type HSMIdList = string[];

export interface HSMStateData {
  nextStateId: string | null;
}

export interface BspHsmState {
  hsmById: BspHsmMap;
  hStateById: BspHStateMap;
  activeHStateByHsm: BspHStateMap;
}
