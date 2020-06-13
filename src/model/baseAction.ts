/** @module Model:base */

import {
  Action,
  Dispatch,
  ActionCreator,
} from 'redux';
import { BsBrightSignPlayerModelState } from '../type';

// -----------------------------------------------------------------------
// Actions
// -----------------------------------------------------------------------

/** @internal */
/** @private */
export const BRIGHTSIGN_PLAYER_MODEL_BATCH = 'BRIGHTSIGN_PLAYER_MODEL_BATCH';

/** @internal */
/** @private */
export const BRIGHTSIGN_PLAYER_MODEL_REHYDRATE = 'BRIGHTSIGN_PLAYER_MODEL_REHYDRATE';

/** @internal */
/** @private */
export const BRIGHTSIGN_PLAYER_MODEL_RESET = 'BRIGHTSIGN_PLAYER_MODEL_RESET';

/** @internal */
/** @private */
export type BsBrightSignPlayerModelDispatch = Dispatch<BsBrightSignPlayerModelState>;
// export type BaApUiModelDispatch = Dispatch<any>;

/** @internal */
/** @private */
export interface BsBrightSignPlayerModelBaseAction extends Action {
  type: string;   // override Any - must be a string
  payload: {};
  error?: boolean;
  meta?: {};
}

/** @internal */
/** @private */
export interface BsBrightSignPlayerModelAction<T> extends BsBrightSignPlayerModelBaseAction {
  payload: T;     // override payload with specific parameter type
}

/** @internal */
/** @private */
export type BsBrightSignPlayerActionCreator<T> = ActionCreator<BsBrightSignPlayerModelAction<T>>;

/** @internal */
/** @private */
export type BsBrightSignPlayerModelThunkAction<T> = (
  dispatch: BsBrightSignPlayerModelDispatch,
  getState: () => BsBrightSignPlayerModelState,
  extraArgument: undefined,
) => T;

/** @internal */
/** @private */
export const bsBrightSignPlayerBatchAction =
    (action: BsBrightSignPlayerModelBaseAction[]): BsBrightSignPlayerModelBatchAction => {
  return {type: BRIGHTSIGN_PLAYER_MODEL_BATCH, payload: action};
};

/** @internal */
/** @private */
export interface BsBrightSignPlayerModelBatchAction extends Action {
  type: string;
  payload: BsBrightSignPlayerModelBaseAction[];
}

/** @internal */
/** @private */
export interface RehydrateBsBrightSignPlayerModelParams {
  newBsBrightSignPlayerModelState: BsBrightSignPlayerModelState;
}

/** @internal */
/** @private */
export type RehydrateBsBrightSignPlayerModelAction =
  BsBrightSignPlayerModelAction<RehydrateBsBrightSignPlayerModelParams>;
export const bsBrightSignPlayerRehydrateModel =
    (bsBrightSignPlayerState: BsBrightSignPlayerModelState): RehydrateBsBrightSignPlayerModelAction => {
  return {
    type: BRIGHTSIGN_PLAYER_MODEL_REHYDRATE,
    payload: {
      newBsBrightSignPlayerModelState: bsBrightSignPlayerState,
    },
  };
};

/** @internal */
/** @private */
export type ResetBsBrightSignPlayerModelAction = BsBrightSignPlayerModelAction<null>;
export const bsBrightSignPlayerResetModel = (): ResetBsBrightSignPlayerModelAction => {
  return {
    type: BRIGHTSIGN_PLAYER_MODEL_RESET,
    payload: null,
  };
};
