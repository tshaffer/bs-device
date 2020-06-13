/** @module Model:base */

import {
  Reducer,
  combineReducers
} from 'redux';
import { BsBrightSignPlayerModelState } from '../type';
import { BsBrightSignPlayerModelBaseAction, BsBrightSignPlayerModelBatchAction, BSBSBRIGHTSIGNPLAYERMODEL_BATCH } from '.';
import { hsmReducer, isValidHSMs } from './hsm';
import { isObject } from 'lodash';

// -----------------------------------------------------------------------
// Defaults
// -----------------------------------------------------------------------

// none

// -----------------------------------------------------------------------
// Reducers
// -----------------------------------------------------------------------
export type BsBrightSignPlayerReducer = Reducer<BsBrightSignPlayerModelState>;
const enableBatching = (
  reduce: (state: BsBrightSignPlayerModelState, action: BsBrightSignPlayerModelBaseAction | BsBrightSignPlayerModelBatchAction) => BsBrightSignPlayerModelState,
): BsBrightSignPlayerReducer => {
  return function batchingReducer(
    state: BsBrightSignPlayerModelState,
    action: BsBrightSignPlayerModelBaseAction | BsBrightSignPlayerModelBatchAction,
  ): BsBrightSignPlayerModelState {
    switch (action.type) {
      case BSBSBRIGHTSIGNPLAYERMODEL_BATCH:
        return (action as BsBrightSignPlayerModelBatchAction).payload.reduce(batchingReducer, state);
      default:
        return reduce(state, action);
    }
  };
};

export const bsBrightSignPlayerReducer: BsBrightSignPlayerReducer =
    enableBatching(combineReducers<BsBrightSignPlayerModelState>({
  hsms: hsmReducer,
}));

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------

export const isValidBsBrightSignPlayerModelState = (state: any): boolean => {
  return isObject(state)
    // TEDTODO
    && state.hasOwnProperty('hsms') && isValidActiveHStates((state as any).hsms);
};

export const isValidBsBrightSignPlayerModelStateShallow = (state: any): boolean => {
  return isObject(state)
    && state.hasOwnProperty('hsms');
};
