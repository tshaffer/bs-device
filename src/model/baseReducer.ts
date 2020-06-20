/** @module Model:base */

import {
  Reducer,
  combineReducers
} from 'redux';
import { isNil } from 'lodash';
import { BsBspModelState } from '../type';
import {
  BRIGHTSIGN_PLAYER_MODEL_BATCH,
  BsBspModelBaseAction,
  BsBspModelBatchAction,
} from './baseAction';
import {
  hsmReducer,
  isValidHsmState
} from './hsm';

// -----------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------

// none

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------

/** @internal */
/** @private */
export type BsBrightSignPlayerReducer = Reducer<BsBspModelState>;

/** @internal */
/** @private */
export const enableBatching = (
  reduce: (state: BsBspModelState,
    action: BsBspModelBaseAction | BsBspModelBatchAction) => BsBspModelState,
): BsBrightSignPlayerReducer => {
  return function batchingReducer(
    state: BsBspModelState,
    action: BsBspModelBaseAction | BsBspModelBatchAction,
  ): BsBspModelState {
    switch (action.type) {
      case BRIGHTSIGN_PLAYER_MODEL_BATCH:
        return (action as BsBspModelBatchAction).payload.reduce(batchingReducer, state);
      default:
        return reduce(state, action);
    }
  };
};

export const bsBspReducer = enableBatching(combineReducers<BsBspModelState>({
  hsm: hsmReducer,
}));

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

/** @internal */
/** @private */
export function isValidBsBrightSignPlayerModelState(state: any): boolean {
  return !isNil(state)
    && state.hasOwnProperty('hsm') && isValidHsmState(state.hsmState);
}

/** @internal */
/** @private */
export function isValidBsBrightSignPlayerModelStateShallow(state: any): boolean {
  return !isNil(state)
    && state.hasOwnProperty('hsm');
}