/** @module Model:base */

import {
  Reducer,
  combineReducers
} from 'redux';
import { isNil } from 'lodash';
import { BsBrightSignPlayerModelState } from '../type';
import {
  BRIGHTSIGN_PLAYER_MODEL_BATCH,
  BsBrightSignPlayerModelBaseAction,
  BsBrightSignPlayerModelBatchAction,
} from './baseAction';
import { hsmReducer, isValidHSMs } from './hsm';

// -----------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------

// none

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------

/** @internal */
/** @private */
export type BsBrightSignPlayerReducer = Reducer<BsBrightSignPlayerModelState>;

/** @internal */
/** @private */
export const enableBatching = (
    reduce: (state: BsBrightSignPlayerModelState,
      action: BsBrightSignPlayerModelBaseAction | BsBrightSignPlayerModelBatchAction) => BsBrightSignPlayerModelState,
): BsBrightSignPlayerReducer => {
  return function batchingReducer(
    state: BsBrightSignPlayerModelState,
    action: BsBrightSignPlayerModelBaseAction | BsBrightSignPlayerModelBatchAction,
  ): BsBrightSignPlayerModelState {
    switch (action.type) {
      case BRIGHTSIGN_PLAYER_MODEL_BATCH:
        return (action as BsBrightSignPlayerModelBatchAction).payload.reduce(batchingReducer, state);
      default:
        return reduce(state, action);
    }
  };
};

export const bsBrightSignPlayerReducer = enableBatching(combineReducers<BsBrightSignPlayerModelState>({
  hsms: hsmReducer,
}));

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

/** @internal */
/** @private */
export function isValidBsBrightSignPlayerModelState(state: any): boolean {
  return !isNil(state)
    && state.hasOwnProperty('hsms') && isValidHSMs(state.hsms);
}

/** @internal */
/** @private */
export function isValidBsBrightSignPlayerModelStateShallow(state: any): boolean {
  return !isNil(state)
    && state.hasOwnProperty('hsms');
}