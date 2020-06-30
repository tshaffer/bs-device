import { isNil } from 'lodash';
import * as fs from 'fs-extra';
import isomorphicPath from 'isomorphic-path';
import { Store } from 'redux';

import {
  BsBspState,
  // BsBspNonThunkAction,
  BspSchedule,
  ArSyncSpecDownload,
  ArSyncSpec,
  // BsBspVoidThunkAction,
  BsBspVoidPromiseThunkAction,
  BsBspNonThunkAction,
  BsBspAnyPromiseThunkAction,
  ArEventType,
  BspHsmMap,
  BspHsm,
  BspHState,
  // ArEventType,
} from '../type';
import {
  bspCreatePlayerHsm,
  bspInitializePlayerHsm,
  bspCreateMediaZoneHsm,
  bspInitializeHsm,
  videoOrImagesZoneGetInitialState,
  hsmDispatch,
} from './hsm';
// import { ArEventType } from '../type';
import {
  getAutoschedule,
  getFile,
  getSyncSpec,
  getSrcDirectory,
  getZoneHsmList,
  // getHsmInitialized,
  getHsms,
  getHsmById,
  getActiveStateIdByHsmId
} from '../selector';
import {
  BsDmId,
  DmSignState,
  dmOpenSign,
  DmState,
  dmGetZoneById,
  DmZone,
  dmGetZonesForSign,
} from '@brightsign/bsdatamodel';
import { hsmConstructorFunction } from './hsm/eventHandler';
// import { ZoneType } from '@brightsign/bscore';

export let _bsBspStore: Store<BsBspState>;

const _queuedEvents: ArEventType[] = [];

export function initPlayer(store: Store<BsBspState>) {
  _bsBspStore = store;
  return ((dispatch: any, getState: () => BsBspState) => {
    dispatch(launchHSM());
  });
}

export function launchHSM() {
  return ((dispatch: any) => {
    dispatch(bspCreatePlayerHsm());
    dispatch(bspInitializePlayerHsm());
  });
}

function getSyncSpecReferencedFile(fileName: string, syncSpec: ArSyncSpec, rootPath: string): Promise<object> {

  const syncSpecFile: ArSyncSpecDownload | null = getFile(syncSpec, fileName);
  if (syncSpecFile == null) {
    return Promise.reject('file not found');
  }

  // const fileSize = syncSpecFile.size;
  const filePath: string = isomorphicPath.join(rootPath, syncSpecFile.link);

  return fs.readFile(filePath, 'utf8')
    .then((fileStr: string) => {

      const file: object = JSON.parse(fileStr);

      // I have commented out the following code to allow hacking of files -
      // that is, overwriting files in the pool without updating the sync spec with updated sha1
      // if (fileSize !== fileStr.length) {
      //   debugger;
      // }
      return Promise.resolve(file);
    });
}

export const restartPlayback = (presentationName: string): BsBspVoidPromiseThunkAction => {
  console.log('invoke restartPlayback');

  return (dispatch: any, getState: any) => {
    const autoSchedule: BspSchedule | null = getAutoschedule(getState());
    if (!isNil(autoSchedule)) {
      //  - only a single scheduled item is currently supported
      const scheduledPresentation = autoSchedule.scheduledPresentations[0];
      const presentationToSchedule = scheduledPresentation.presentationToSchedule;
      presentationName = presentationToSchedule.name;
      const autoplayFileName = presentationName + '.bml';

      const syncSpec = getSyncSpec(getState());
      if (!isNil(syncSpec)) {
        return getSyncSpecReferencedFile(autoplayFileName, syncSpec, getSrcDirectory(getState()))
          .then((bpfxState: any) => {
            const autoPlay: any = bpfxState.bsdm;
            const signState = autoPlay as DmSignState;
            dispatch(dmOpenSign(signState));
          });
      }
      return Promise.resolve();
    } else {
      return Promise.resolve();
    }
  };
};

export const startPlayback = (): BsBspNonThunkAction => {
  console.log('invoke startPlayback');

  return (dispatch: any, getState: any) => {

    const bsdm: DmState = getState().bsdm;
    console.log('startPlayback');
    console.log(bsdm);

    const zoneIds: BsDmId[] = dmGetZonesForSign(bsdm);
    zoneIds.forEach((zoneId: BsDmId) => {
      const bsdmZone: DmZone = dmGetZoneById(bsdm, { id: zoneId }) as DmZone;
      dispatch(bspCreateMediaZoneHsm(zoneId + '-' + bsdmZone.type, bsdmZone.type.toString(), bsdmZone));
    });

    const promises: Array<Promise<any>> = [];

    const zoneHsmList = getZoneHsmList(getState());
    for (const zoneHsm of zoneHsmList) {
      dispatch(hsmConstructorFunction(zoneHsm.id));
      const action = bspInitializeHsm(
        zoneHsm.id,
        getVideoOrImagesInitialState
      );
      promises.push(dispatch(action));
    }

    Promise.all(promises).then(() => {
      console.log('startPlayback nearly complete');
      console.log('wait for HSM initialization complete');
      const hsmInitializationComplete = hsmInitialized(getState());
      if (hsmInitializationComplete) {
        const event: ArEventType = {
          EventType: 'NOP',
        };
        dispatch(queueHsmEvent(event));
      }
    });

  };
};

// TEDTODO - separate queues for each hsm?
export const queueHsmEvent = (event: ArEventType): any => {
  return ((dispatch: any, getState: any) => {
    if (event.EventType !== 'NOP') {
      _queuedEvents.push(event);
    }
    if (hsmInitialized(getState())) {
      while (_queuedEvents.length > 0) {
        dispatch(dispatchHsmEvent(_queuedEvents[0]));
        _queuedEvents.shift();
      }
    }
  });
};

function dispatchHsmEvent(
  event: ArEventType
): any {

  return ((dispatch: any, getState: any) => {

    console.log('dispatchHsmEvent:');
    console.log(event.EventType);

    const state: BsBspState = getState();

    const playerHsm: BspHsm = getHsmById(state, 'player');
    if (!isNil(playerHsm)) {
      dispatch(hsmDispatch(event, playerHsm.id, playerHsm.activeStateId));
    }

    const hsmMap: BspHsmMap = getHsms(state);
    for (const hsmId in hsmMap) {
      if (hsmId !== playerHsm.id) {
        const activeState: BspHState | null = getActiveStateIdByHsmId(state, hsmId);
        if (!isNil(activeState)) {
          dispatch(hsmDispatch(event, hsmId, activeState.id));
        } else {
          debugger;
        }
      }
    }
  });
}

const hsmInitialized = (state: BsBspState): boolean => {

  const hsmMap: BspHsmMap = getHsms(state);
  for (const hsmId in hsmMap) {
    if (hsmMap.hasOwnProperty(hsmId)) {
      const hsm: BspHsm = hsmMap[hsmId];
      if (!hsm.initialized) {
        return false;
      }
    }
  }

  // TEDTODO - need to check if the hsm's associated with zones exist yet
  console.log('number of hsms:');
  console.log(Object.keys(hsmMap).length);

  return true;
};

export const getVideoOrImagesInitialState = (): BsBspAnyPromiseThunkAction => {
  return (dispatch: any, getState: any) => {
    console.log('invoke getVideoOrImagesInitialState');
    return Promise.resolve(videoOrImagesZoneGetInitialState);
  };
};
