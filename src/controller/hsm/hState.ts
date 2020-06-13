import { HState, HSM, HSMStateData } from '../../type/hsm';
import { ArEventType } from '../../type/base';

export class BsHState implements HState {
  topState: HState;
  stateMachine: HSM;
  superState: HState;
  id: string;

  HStateEventHandler: (event: ArEventType, stateData: HSMStateData) => any;

  constructor(stateMachine: HSM, id: string) {

    // filled in by HState instance
    // this.HStateEventHandler = null; TEDTODO - ts doesn't like this

    this.stateMachine = stateMachine;

    // filled in by HState instance
    // this.superState = null;  TEDTODO - ts doesn't like this
    this.id = id;
  }
}

export function STTopEventHandler(_: ArEventType, stateData: HSMStateData) {

  return ((dispatch: any) => {
    stateData.nextState = null;
    return 'IGNORED';
  });
}
