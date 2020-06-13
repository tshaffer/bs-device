/** @internal */

import { ArEventType } from "./base";

/** @private */
export interface HSM {
  readonly hsmId: string;
  readonly topState: HState;
  readonly activeState: HState | null;
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
