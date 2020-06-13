/** @module Model:template */

import {
  HSMList,
  HSM,
 } from '../type';
import { BsBrightSignPlayerBatchAction, BsBrightSignPlayerAction } from './baseAction';

/** @internal */
/** @private */
export const ADD_HSM: string = 'ADD_HSM';

/** @internal */
/** @private */
// export type AddHsmAction = BsBrightSignPlayerAction<Partial<BsBrightSignPlayerModelState>>;
// export type AddHsmAction = BsBrightSignPlayerAction<Partial<HSM>>;
export type AddHsmAction = BsBrightSignPlayerAction<HSM>;

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
  action: BsBrightSignPlayerBatchAction) => {
  switch (action.type) {

    case ADD_HSM: {

      const newState: HSMList = state.slice(0);
      // TEDTODO
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

// TEDTODO
