import { Store } from 'redux';
import { BsBspState, ArEventType } from '../type/base';
import { bspCreatePlayerHsm, bspInitializePlayerHsm } from './hsm';
// import { HSM } from '../type';

// let _hsmList: HSM[] = [];

export function initPlayer(store: Store<BsBspState>) {
  return ((dispatch: any, getState: () => BsBspState) => {
    dispatch(launchHSM());
  });
}

function launchHSM() {
  return ((dispatch: any) => {
    dispatch(bspCreatePlayerHsm());
    dispatch(bspInitializePlayerHsm());
    // const _playerHSM = new PlayerHSM('playerHSM', startPlayback, restartPlayback, postMessage, queueHsmEvent);
    // console.log(_playerHSM);
    // const action: any = _playerHSM.hsmInitialize().bind(_playerHSM);
    // dispatch(action).then(() => {
    //   console.log('return from hsmInitialize');
    //   // const hsmInitializationComplete = hsmInitialized();
    //   // console.log('69696969 - end of launchHSM, hsmInitializationComplete = ' + hsmInitializationComplete);
    // });
  });
}

// function startPlayback() {

//   return (dispatch: any, getState: any) => {
//     console.log('startPlayback');
//   };
// }

// function restartPlayback(presentationName: string): Promise<void> {
//   return Promise.resolve();
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
