/** @module Model:template */

import {
  HSMList,
  HSM,
  HStateMap,
  BspHsmState,
  // BsBrightSignPlayerModelState,
} from '../type';
import {
  BsBspModelBatchAction,
  BsBspModelAction,
} from './baseAction';
import { isObject } from 'lodash';
import { combineReducers } from 'redux';

// ------------------------------------
// Constants
// ------------------------------------

/** @internal */
/** @private */
export const ADD_HSM: string = 'ADD_HSM';
export const SET_ACTIVE_HSTATE = 'SET_ACTIVE_HSTATE';

/** @internal */
/** @private */
// export type AddHsmAction = BsBrightSignPlayerModelAction<Partial<BsBrightSignPlayerModelState>>;
// export type AddHsmAction = BsBrightSignPlayerModelAction<HSM>;
export type AddHsmAction = BsBspModelAction<Partial<HSM>>;

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

/** @internal */
/** @private */
export type SetActiveHStateAction = BsBspModelAction<any>;
export function setActiveHState(hsmId: string, activeState: any): SetActiveHStateAction {
  return {
    type: SET_ACTIVE_HSTATE,
    payload: {
      hsmId,
      activeState,
    },
  };
}

// ------------------------------------
// Reducer
// ------------------------------------

const initialHsmListState: HSMList = [];
/** @internal */
/** @private */
const hsmList = (
  state: HSMList = initialHsmListState,
  action: BsBspModelBatchAction) => {
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

const initialHStateState: HStateMap = {};
export const hStatesById = (
  state: HStateMap = initialHStateState,
  action: BsBspModelBatchAction) => {
  switch (action.type) {
    case SET_ACTIVE_HSTATE: {
      const newState: HStateMap = Object.assign({}, state);
      const { hsmId, activeState } = action.payload as any;
      newState[hsmId] = activeState;
      return newState;
    }
    default:
      return state;
  }
};

const hsmReducer = combineReducers<BspHsmState>(
  { hsmList, hStatesById });

/** @internal */
/** @private */
export default hsmReducer;

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------
/** @internal */
/** @private */
export const isValidHSMs = (state: any): boolean => {
  return isObject(state);
  // TEDTODO
};
