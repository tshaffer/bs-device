import {
  BsBspState,
  BspHsm,
  BspHState,
  HStateData,
  BspHStateMap,
  PlayerHStateData,
  MediaHStateData,
  // BspHsmType,
} from '../type';
import { isNil, isString } from 'lodash';
import { BspHsmMap } from '../type';
// import { DmMediaState, dmGetMediaStateById, dmFilterDmState } from '@brightsign/bsdatamodel';

// ------------------------------------
// Selectors
// ------------------------------------
export function getHsmById(state: BsBspState, hsmId: string): BspHsm {
  return state.bsPlayer.hsmState.hsmById[hsmId];
}

export function getHsmByName(state: BsBspState, hsmName: string): BspHsm | null {
  const hsmMap: BspHsmMap = getHsms(state);
  for (const hsmId in hsmMap) {
    if (hsmMap.hasOwnProperty(hsmId)) {
      const hsm = hsmMap[hsmId];
      if (hsm.name === hsmName) {
        return hsm;
      }
    }
  }
  return null;
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
  const hState = state.bsPlayer.hsmState.hStateById[hStateId];
  if (isNil(hState)) {
    debugger;
  }
  return hState;
}

export function getHStateByName(state: BsBspState, name: string | null): BspHState | null {
  if (isNil(name)) {
    return null;
  }
  const hStateMap: BspHStateMap = state.bsPlayer.hsmState.hStateById;

  for (const hStateId in hStateMap) {
    if (hStateMap.hasOwnProperty(hStateId)) {
      const hState = hStateMap[hStateId];
      if (!isNil(hState.hStateData)
        && isString((hState.hStateData as PlayerHStateData).name)
        && (hState.hStateData as PlayerHStateData).name === name) {
        return hState;
      }
    }
  }

  debugger;
  return null;
}

export function getHStateByMediaStateId(state: BsBspState, mediaStateId: string | null): BspHState | null {
  if (isNil(mediaStateId)) {
    return null;
  }
  const hStateMap: BspHStateMap = state.bsPlayer.hsmState.hStateById;

  for (const hStateId in hStateMap) {
    if (hStateMap.hasOwnProperty(hStateId)) {
      const hState = hStateMap[hStateId];
      if (!isNil(hState.hStateData)
        && isString((hState.hStateData as MediaHStateData).mediaStateId)
        && (hState.hStateData as MediaHStateData).mediaStateId === mediaStateId) {
        return hState;
      }
    }
  }

  debugger;
  return null;
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
    if (!isNil(zoneHsm.hsmData)) {
      if (zoneHsm.hsmData.zoneId === zoneId) {
        const hState: BspHState | null = getActiveStateIdByHsmId(state, zoneHsm.id);
        if (!isNil(hState)
          && !isNil(hState.hStateData)
          && isString((hState.hStateData as MediaHStateData).mediaStateId)
        ) {
          return (hState.hStateData as MediaHStateData).mediaStateId;
        }
      }
    }
  }
  return '';
}
