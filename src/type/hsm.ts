import { BspMap } from './base';

export type BspHsmMap = BspMap<BspHsm>;
export type BspHStateMap = BspMap<BspHState>;

export interface BspHsm {
  id: string;
  type: string;
  topStateId: string;
  activeStateId: string | null;
  initialized: boolean;
}

export interface BspHState {
  id: string;
  hsmId: string;
  topStateId: string;
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
  hStateById: HStateMap;
}

export interface HStateMap {
  [hsmId: string]: string | null;
}

export interface IHStateMap {
  [hsmId: string]: string | null;
}
