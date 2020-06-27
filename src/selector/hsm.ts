import {
  BsBspState,
  BspHsm,
  BspHState,
  // BspHsmType,
} from '../type';
import { isNil } from 'lodash';
import { BspHsmMap } from '../..';

// ------------------------------------
// Selectors
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

export function getHsmInitialized(state: BsBspState, hsmId: string): boolean {
  return state.bsPlayer.hsmState.hsmById[hsmId].initialized;
}

export function getZoneHsmList(state: BsBspState): BspHsm[] {
  const hsmList: BspHsm[] = [];
  const hsmById: BspHsmMap = state.bsPlayer.hsmState.hsmById;
  for (const hsmId in hsmById) {
    if (hsmById.hasOwnProperty(hsmId)) {
      const hsm: BspHsm = hsmById[hsmId];
      if (hsm.type === 'VideoOrImages') {
        hsmList.push(hsm);
      }
    }
  }
  return hsmList;
}