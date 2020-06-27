import { Store } from 'redux';

import { BsBspState } from '../type';
import { bspCreatePlayerHsm, bspInitializePlayerHsm } from './hsm';
import { ArEventType } from '../type';

let _autotronStore: Store<BsBspState>;

export function initPlayer(store: Store<BsBspState>) {
  return ((dispatch: any, getState: () => BsBspState) => {
    _autotronStore = store;
    console.log(_autotronStore);
    dispatch(launchHSM());
  });
}

function launchHSM() {
  return ((dispatch: any) => {
    dispatch(bspCreatePlayerHsm());
    dispatch(bspInitializePlayerHsm());
  });
}

export const restartPlayback = (presentationName: string): Promise<void> => {
  console.log('invoke restartPlayback');

  // const rootPath = getRootDirectory();

  // // TEDTODO - only a single scheduled item is currently supported
  // const scheduledPresentation = _autoSchedule.scheduledPresentations[0];
  // const presentationToSchedule = scheduledPresentation.presentationToSchedule;

  // presentationName = presentationToSchedule.name;

  // const autoplayFileName = presentationName + '.bml';

  // return getSyncSpecReferencedFile(autoplayFileName, _syncSpec, rootPath)
  //   .then((bpfxState: any) => {
  //     const autoPlay: any = bpfxState.bsdm;
  //     const signState = autoPlay as DmSignState;
  //     _autotronStore.dispatch(dmOpenSign(signState));
  //     return Promise.resolve();
  //   });
  return Promise.resolve();
};

// function startPlayback() {

//   return (dispatch: any, getState: any) => {
//     console.log('startPlayback');
//   };
// }

export function postMessage(event: ArEventType) {
  return ((dispatch: any) => {
    console.log('postMessage');
  });
}

export function queueHsmEvent(event: ArEventType) {
  return (dispatch: any) => {
    console.log('restartPlayback');
  };
}
