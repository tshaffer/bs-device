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
import {
  cloneDeep,
  isObject,
  isNil,
} from 'lodash';
import { combineReducers } from 'redux';

// ------------------------------------
// Constants
// ------------------------------------

export const ADD_HSM: string = 'ADD_HSM';
export const SET_HSM_TOP: string = 'SET_HSM_TOP';
export const SET_HSM_INITIALIZED: string = 'SET_HSM_INITIALIZED';
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

interface SetHsmTopActionParams {
  hsmId: string;
  topStateId: string;
}
export type SetHsmTopAction = BsBspModelAction<{}>;
export function setHsmTop(
  hsmId: string,
  topStateId: string,
): SetHsmTopAction {
  return {
    type: SET_HSM_TOP,
    payload: {
      hsmId,
      topStateId,
    }
  };
}

export type SetHsmInitializedAction = BsBspModelAction<Partial<BspHsm>>;
export function setHsmInitialized(
  id: string,
  initialized: boolean,
): SetHsmInitializedAction {
  return {
    type: SET_HSM_INITIALIZED,
    payload: {
      id,
      initialized,
    }
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

export type AddHStateAction = BsBspModelAction<Partial<BspHState>>;
export function addHState(
  hState: BspHState,
): AddHStateAction {
  return {
    type: ADD_HSTATE,
    payload: hState,
  };
}

// ------------------------------------
// Reducer
// ------------------------------------
const initialHsmByIdState: BspHsmMap = {};
const hsmById = (
  state: BspHsmMap = initialHsmByIdState,
  action: AddHsmAction | SetHsmTopAction | SetHsmInitializedAction
): BspHsmMap => {
  switch (action.type) {
    case ADD_HSM: {
      const id: string = (action.payload as BspHsm).id;
      return { ...state, [id]: (action.payload as BspHsm) };
    }
    case SET_HSM_TOP: {
      const { hsmId, topStateId } = action.payload as SetHsmTopActionParams;
      const newState = cloneDeep(state) as BspHsmMap;
      const hsm: BspHsm = newState[hsmId];
      hsm.topStateId = topStateId;
      return newState;
    }
    case SET_HSM_INITIALIZED: {
      const id: string = (action as SetHsmInitializedAction).payload.id as string;
      const initialized: boolean  = !(action as SetHsmInitializedAction).payload.initialized;
      const newState = cloneDeep(state) as BspHsmMap;
      const hsm: BspHsm = newState[id];
      hsm.initialized = initialized;
      return newState;
    }
    case SET_ACTIVE_HSTATE: {
      const newState = Object.assign({}, state);
      const hsmId: string = (action.payload as any).id;
      const activeState: BspHState = (action.payload as any).activeState;
      if (isNil(activeState)) {
        newState[hsmId].activeStateId = null;
      } else {
        newState[hsmId].activeStateId = activeState.id;
      }
      return newState;
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

// TEDTODO - remove??
const initialActiveHStateByHsm: BspHStateMap = {};
const activeHStateByHsm = (
  state: BspHStateMap = initialActiveHStateByHsm,
  action: SetActiveHStateAction,
): BspHStateMap => {
  switch (action.type) {
    // case SET_ACTIVE_HSTATE: {
    //   const newState: BspHStateMap = Object.assign({}, state);
    //   // const hsmId: string = (action.payload as BspHState).hsmId;
    //   const hsmId: string = (action.payload as any).id;
    //   // const activeState: BspHState = action.payload as BspHState;
    //   const activeState: BspHState = (action.payload as any).activeState;
    //   newState[hsmId] = activeState;
    //   return newState;
    // }
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
