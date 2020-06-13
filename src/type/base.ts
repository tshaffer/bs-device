/** @module Types:base */

import { DmState } from '@brightsign/bsdatamodel';

import { HSM } from './hsm';

/** @internal */
/** @private */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

/** @internal */
/** @private */
export interface BsBspState {
  bsdm: DmState;
  bsPlayer: BsBspModelState;
}

/** @internal */
/** @private */
export interface BsBspModelState {
  hsms: HSM[];
}

export interface ArEventType {
  EventType: string;
  data?: any;
  EventData?: any;
}
