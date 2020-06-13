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
export interface BsBrightSignPlayerState {
  bsdm: DmState;
  bsPlayer: BsBrightSignPlayerModelState;
}

/** @internal */
/** @private */
export interface BsBrightSignPlayerModelState {
  hsms: HSM[];
}

export interface ArEventType {
  EventType: string;
  data?: any;
  EventData?: any;
}
