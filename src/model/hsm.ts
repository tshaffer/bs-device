/** @module Model:template */

import {
  HSMList,
  HSM,
  // BsBrightSignPlayerModelState,
 } from '../type';
import {
  BsBrightSignPlayerModelBatchAction,
  BsBrightSignPlayerModelAction,
} from './baseAction';
import { isObject } from 'lodash';

/** @internal */
/** @private */
export const ADD_HSM: string = 'ADD_HSM';

/** @internal */
/** @private */
// export type AddHsmAction = BsBrightSignPlayerModelAction<Partial<BsBrightSignPlayerModelState>>;
export type AddHsmAction = BsBrightSignPlayerModelAction<Partial<HSM>>;
// export type AddHsmAction = BsBrightSignPlayerModelAction<HSM>;

/** @internal */
/** @private */
export function addHSM(
  hsm: HSM,
): AddHsmAction {
  return {
    type: ADD_HSM,
    payload: hsm,
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialState: HSMList = [];

/** @internal */
/** @private */
export const hsmReducer = (
  state: HSMList = initialState,
  action: BsBrightSignPlayerModelBatchAction) => {
  switch (action.type) {

    case ADD_HSM: {

      const newState: HSMList = state.slice(0);
      // TEDTODO
      // newState.push(action.payload);
      newState.push(action.payload as any);

      return newState;
    }
    default:
      return state;
  }
};

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------
/** @internal */
/** @private */
export const isValidHSMs = (state: any): boolean => {
  return isObject(state);
  // TEDTODO
};
