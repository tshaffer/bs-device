import {
  BsBspState,
  BspHsm,
  BspHState,
  HStateData,
  // BspHsmType,
} from '../type';
import { isNil } from 'lodash';
import { BspHsmMap } from '../..';
// import { DmMediaState, dmGetMediaStateById, dmFilterDmState } from '@brightsign/bsdatamodel';

// ------------------------------------
// Selectors
// ------------------------------------
export function getHsmById(state: BsBspState, hsmId: string): BspHsm {
  return state.bsPlayer.hsmState.hsmById[hsmId];
}

export function getHsms(state: BsBspState): BspHsmMap {
  return state.bsPlayer.hsmState.hsmById;
}

export const getActiveStateIdByHsmId = (
  state: BsBspState,
  hsmId: string
): BspHState | null => {
  const hsm: BspHsm = getHsmById(state, hsmId);
  if (!isNil(hsm)) {
    return getHStateById(state, hsm.activeStateId);
  }
  return null;
};

export function getHStateById(state: BsBspState, hStateId: string | null): BspHState | null {
  if (isNil(hStateId)) {
    return null;
  }
  return state.bsPlayer.hsmState.hStateById[hStateId];
}

export function getHStateData(state: BsBspState, hStateId: string | null): HStateData | null {
  if (isNil(hStateId)) {
    return null;
  }
  const hState: BspHState | null = getHStateById(state, hStateId);
  if (isNil(hState)) {
    return null;
  }
  if (isNil(hState.hStateData)) {
    return null;
  }
  return hState.hStateData;
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

export function getActiveMediaStateId(state: BsBspState, zoneId: string): string {
  const zoneHsmList: BspHsm[] = getZoneHsmList(state);
  for (const zoneHsm of zoneHsmList) {
    if (zoneHsm.id.indexOf(zoneId) >= 0) {
      const hState: BspHState | null = getActiveStateIdByHsmId(state, zoneHsm.id);
      if (!isNil(hState)) {
        return hState.id;
      }
    }
  }
  return '';
}