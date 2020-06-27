/** @module Types:base */
import {
  Action,
  Dispatch,
} from 'redux';

import { DmState } from '@brightsign/bsdatamodel';
import { BspHsmState } from './hsm';
import { PresentationDataState } from './presentation';

export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

export interface BsBspModelState {
  hsmState: BspHsmState;
  presentationData: PresentationDataState;
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

// TEDTODO - duplicates shapes in ../model/baseAction.ts
export interface BsBspBaseAction extends Action {
  type: string;
  payload: {} | null;
  error?: boolean;
  meta?: {};
}

export interface BsBspAction<T> extends BsBspBaseAction {
  payload: T;
}

export type BsBspDispatch = Dispatch<BsBspState>;
export type BsBspNonThunkAction =
  (dispatch: BsBspDispatch, getState: () => BsBspState) => void;
export type BsBspVoidThunkAction =
  (dispatch: BsBspDispatch, getState: () => BsBspState, extraArgument: undefined) => void;
export type BsBspStringThunkAction =
  (dispatch: BsBspDispatch, getState: () => BsBspState, extraArgument: undefined) => string;
export type BsBspVoidPromiseThunkAction =
  (dispatch: BsBspDispatch, getState: () => BsBspState, extraArgument: undefined) => Promise<void>;
export type BsBspThunkAction<T> =
  (dispatch: BsBspDispatch, getState: () => BsBspState, extraArgument: undefined) => BsBspAction<T>;
export type BsBspAnyPromiseThunkAction =
  (dispatch: BsBspDispatch, getState: () => BsBspState, extraArgument: undefined) => Promise<any>;
