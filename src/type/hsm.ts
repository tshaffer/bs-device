/** @internal */

import { ArEventType } from './base';

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
