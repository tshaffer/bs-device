
import { ArEventType } from './base';

export interface IHSM {
  hsmId: string;
  topStateId: string;
  activeStateId: string | null;
  initialized: boolean;
}

export interface IHState {
  id: string;
  stateMachineId: string;
  topStateId: string;
  superStateId: string;
}

/** @internal */
/** @private */
export interface HSM {
  readonly hsmId: string;
  readonly topState: HState;
  readonly activeState: HState | null;

  dispatchEvent: ((event: ArEventType) => void);
  constructorHandler: (() => void) | null;
  initialPseudoStateHandler: () => (HState | null);
  initialized: boolean;
}

export interface HState {
  topState: HState;
  stateMachine: HSM;
  superState: HState;
  id: string;

  HStateEventHandler: (event: ArEventType, stateData: HSMStateData) => any;

}

export interface HSMStateData {
  nextState: HState | null;
}

export type HSMList = HSM[];
export type IHSMList = IHSM[];

export interface HSMStateData {
  nextState: HState | null;
}

export interface BspHsmState {
  hsmList: HSMList[];
  hStatesById: HStateMap;
}

export interface HStateMap {
  [hsmId: string]: string | null;
}

export interface IHStateMap {
  [hsmId: string]: string | null;
}
