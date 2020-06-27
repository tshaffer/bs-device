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
} from '../type';
import {
  bspCreatePlayerHsm,
  bspInitializePlayerHsm,
} from './hsm';
// import { ArEventType } from '../type';
import { getAutoschedule, getFile, getSyncSpec, getSrcDirectory } from '../selector';
import { DmSignState, dmOpenSign } from '@brightsign/bsdatamodel';

export function initPlayer(store: Store<BsBspState>) {
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
      // TEDTODO - only a single scheduled item is currently supported
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
