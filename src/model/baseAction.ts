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
// export type BsBrightSignPlayerModelDispatch = Dispatch<BsBrightSignPlayerModelState>;
export type BsBspModelDispatch = Dispatch<any>;
// export type BaApUiModelDispatch = Dispatch<any>;

/** @internal */
/** @private */
export interface BsBspModelBaseAction extends Action {
  type: string;   // override Any - must be a string
  payload: {};
  error?: boolean;
  meta?: {};
}

/** @internal */
/** @private */
export interface BsBspModelAction<T> extends BsBspModelBaseAction {
  payload: T;     // override payload with specific parameter type
}

/** @internal */
/** @private */
export type BsBspActionCreator<T> = ActionCreator<BsBspModelAction<T>>;

/** @internal */
/** @private */
export type BsBspModelThunkAction<T> = (
  dispatch: BsBspModelDispatch,
  getState: () => BsBspModelState,
  extraArgument: undefined,
) => T;

/** @internal */
/** @private */
export const bsBspBatchAction =
    (action: BsBspModelBaseAction[]): BsBspModelBatchAction => {
  return {type: BRIGHTSIGN_PLAYER_MODEL_BATCH, payload: action};
};

/** @internal */
/** @private */
export interface BsBspModelBatchAction extends Action {
  type: string;
  payload: BsBspModelBaseAction[];
}

/** @internal */
/** @private */
export interface RehydrateBsBspModelParams {
  newBsBrightSignPlayerModelState: BsBspModelState;
}

/** @internal */
/** @private */
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

/** @internal */
/** @private */
export type ResetBsBspModelAction = BsBspModelAction<null>;
export const bsBrightSignPlayerResetModel = (): ResetBsBspModelAction => {
  return {
    type: BRIGHTSIGN_PLAYER_MODEL_RESET,
    payload: null,
  };
};
