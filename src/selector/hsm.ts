// ------------------------------------
// Selectors

import {
  BsBspState,
  BspHsm,
  BspHState,
} from '../type';
import { isNil } from 'lodash';

// ------------------------------------
export function getHsmById(state: BsBspState, hsmId: string): BspHsm {
  return state.bsPlayer.hsmState.hsmById[hsmId];
}

export function getHStateById(state: BsBspState, hStateId: string | null): BspHState | null {
  if (isNil(hStateId)) {
    return null;
  }
  return state.bsPlayer.hsmState.hStateById[hStateId];
}
