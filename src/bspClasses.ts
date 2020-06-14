import { BspHsm } from './type/hsm';

export class BspcHsm implements BspHsm {
  // TEDTODO - readonly
  hsmId: string;
  topStateId: string;
  activeStateId: string | null;
  initialized: boolean;

  constructor(hsmState: BspHsm) {
    this.hsmId = hsmState.hsmId;
    this.topStateId = hsmState.topStateId;
    this.activeStateId = hsmState.activeStateId;
    this.initialized = hsmState.initialized;
  }
}
