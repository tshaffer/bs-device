/** @module Model:base */

import {
  Action,
  Dispatch,
  ActionCreator,
} from 'redux';
import { BsBspModelState } from '../type';

// -----------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------

export const BRIGHTSIGN_PLAYER_MODEL_BATCH = 'BRIGHTSIGN_PLAYER_MODEL_BATCH';
export const BRIGHTSIGN_PLAYER_MODEL_REHYDRATE = 'BRIGHTSIGN_PLAYER_MODEL_REHYDRATE';
export const BRIGHTSIGN_PLAYER_MODEL_RESET = 'BRIGHTSIGN_PLAYER_MODEL_RESET';

export type BsBspModelDispatch = Dispatch<any>;

export interface BsBspModelBaseAction extends Action {
  type: string;   // override Any - must be a string
  payload: {};
  error?: boolean;
  meta?: {};
}

export interface BsBspModelAction<T> extends BsBspModelBaseAction {
  payload: T;     // override payload with specific parameter type
}

export type BsBspActionCreator<T> = ActionCreator<BsBspModelAction<T>>;
export type BsBspModelThunkAction<T> = (
  dispatch: BsBspModelDispatch,
  getState: () => BsBspModelState,
  extraArgument: undefined,
) => T;

export const bsBspBatchAction =
    (action: BsBspModelBaseAction[]): BsBspModelBatchAction => {
  return {type: BRIGHTSIGN_PLAYER_MODEL_BATCH, payload: action};
};

export interface BsBspModelBatchAction extends Action {
  type: string;
  payload: BsBspModelBaseAction[];
}

export interface RehydrateBsBspModelParams {
  newBsBrightSignPlayerModelState: BsBspModelState;
}

export type RehydrateBsBspModelAction =
  BsBspModelAction<RehydrateBsBspModelParams>;
export const bsBrightSignPlayerRehydrateModel =
    (bsBrightSignPlayerState: BsBspModelState): RehydrateBsBspModelAction => {
  return {
    type: BRIGHTSIGN_PLAYER_MODEL_REHYDRATE,
    payload: {
      newBsBrightSignPlayerModelState: bsBrightSignPlayerState,
    },
  };
};

export type ResetBsBspModelAction = BsBspModelAction<null>;
export const bsBrightSignPlayerResetModel = (): ResetBsBspModelAction => {
  return {
    type: BRIGHTSIGN_PLAYER_MODEL_RESET,
    payload: null,
  };
};
