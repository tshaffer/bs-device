/** @module Types:base */

import { DmState } from '@brightsign/bsdatamodel';
import { BspHsmState } from './hsm';

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface BsBspModelState {
  hsmState: BspHsmState;
}

export interface BsBspState {
  bsdm: DmState;
  bsPlayer: BsBspModelState;
}

export interface BspBaseObject {
  id: string;
}

export interface BspMap<T extends BspBaseObject> {
  [id: string]: T;    // really '[id:BsDmId]: T;' -- but Typescript doesn't like that, even though BsDmId = string
}

export interface ArEventType {
  EventType: string;
  data?: any;
  EventData?: any;
}
