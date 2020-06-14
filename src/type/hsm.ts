
export interface BspHsm {
  hsmId: string;
  topStateId: string;
  activeStateId: string | null;
  initialized: boolean;
}

export interface BspHState {
  id: string;
  stateMachineId: string;
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
  hsmIdList: HSMIdList[];
  hStatesById: HStateMap;
}

export interface HStateMap {
  [hsmId: string]: string | null;
}

export interface IHStateMap {
  [hsmId: string]: string | null;
}
