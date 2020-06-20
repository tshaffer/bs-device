/** @module Model:template */

import {
  BspHsmState,
  BspHsm,
  BspHsmMap,
  BspHStateMap,
  BspHState,
} from '../type';
import {
  BsBspModelAction,
} from './baseAction';
import { isObject } from 'lodash';
import { combineReducers } from 'redux';

// ------------------------------------
// Constants
// ------------------------------------

export const ADD_HSM: string = 'ADD_HSM';
export const ADD_HSTATE = 'ADD_HSTATE';
export const SET_ACTIVE_HSTATE = 'SET_ACTIVE_HSTATE';

export type AddHsmAction = BsBspModelAction<Partial<BspHsm>>;

export function addHsm(
  hsm: BspHsm,
): AddHsmAction {
  return {
    type: ADD_HSM,
    payload: hsm,
  };
}

export type AddHStateAction = BsBspModelAction<Partial<BspHState>>;
export function addHState(
  hState: BspHState,
): AddHStateAction {
  return {
    type: ADD_HSTATE,
    payload: hState,
  };
}

export type SetActiveHStateAction = BsBspModelAction<BspHState | null | any>;
export function setActiveHState(
  hsmId: string,
  activeState: BspHState | null,
): SetActiveHStateAction {
  return {
    type: SET_ACTIVE_HSTATE,
    payload: {
      id: hsmId,
      activeState,
    }
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialHsmByIdState: BspHsmMap = {};
const hsmById = (
  state: BspHsmMap = initialHsmByIdState,
  action: AddHsmAction
): BspHsmMap => {
  switch (action.type) {
    case ADD_HSM: {
      const id: string = (action.payload as BspHsm).id;
      return { ...state, [id]: (action.payload as BspHsm) };
    }
    default:
      return state;
  }
};

const initialHStateByIdState: BspHStateMap = {};
const hStateById = (
  state: BspHStateMap = initialHStateByIdState,
  action: AddHStateAction,
): BspHStateMap => {
  switch (action.type) {
    case ADD_HSTATE: {
      const id: string = (action.payload as BspHState).id;
      return { ...state, [id]: (action.payload as BspHState) };
    }
    default:
      return state;
  }
};

const initialActiveHStateByHsm: BspHStateMap = {};
const activeHStateByHsm = (
  state: BspHStateMap = initialActiveHStateByHsm,
  action: SetActiveHStateAction,
): BspHStateMap => {
  switch (action.type) {
    case SET_ACTIVE_HSTATE: {
      const newState: BspHStateMap = Object.assign({}, state);
      const hsmId: string = (action.payload as BspHState).hsmId;
      const activeState: BspHState = action.payload as BspHState;
      newState[hsmId] = activeState;
      return newState;
    }
    default:
      return state;
  }
};

export const hsmReducer = combineReducers<BspHsmState>(
  { hsmById, hStateById, activeHStateByHsm });

// -----------------------------------------------------------------------
// Validators
// -----------------------------------------------------------------------
/** @internal */
/** @private */
export const isValidHsmState = (state: any): boolean => {
  return isObject(state);
  // TEDTODO
};
