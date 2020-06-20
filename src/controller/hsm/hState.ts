import { BspHState, HSMStateData, BspHsm } from '../../type/hsm';
import { ArEventType } from '../../type/base';

export class BsHState implements BspHState {
  id: string;
  stateMachineId: string;
  topStateId: string;
  superStateId: string;

  HStateEventHandler: (event: ArEventType, stateData: HSMStateData) => any;

  constructor(stateMachine: BspHsm, id: string) {

    // filled in by HState instance
    // this.HStateEventHandler = null; TEDTODO - ts doesn't like this

    this.stateMachineId = stateMachine.hsmId;

    // filled in by HState instance
    // this.superState = null;  TEDTODO - ts doesn't like this
    this.id = id;
  }
}

export function STTopEventHandler(_: ArEventType, stateData: HSMStateData) {

  return ((dispatch: any) => {
    stateData.nextStateId = null;
    return 'IGNORED';
  });
}
