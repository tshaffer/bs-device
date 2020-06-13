// ------------------------------------
// Constants

import { BsBrightSignPlayerModelBaseAction } from './baseAction';

// ------------------------------------
export const SET_ACTIVE_HSTATE = 'SET_ACTIVE_HSTATE';

// ------------------------------------
// Actions
// ------------------------------------
export function setActiveHState(hsmId: string, activeState: any): BsBrightSignPlayerModelBaseAction {
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
