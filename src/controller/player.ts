import { Store } from 'redux';
import { BsBrightSignPlayerState, ArEventType } from '../type/base';
import { PlayerHSM } from './hsm';
// import { HSM } from '../type';

// let _hsmList: HSM[] = [];

export function initPlayer(store: Store<BsBrightSignPlayerState>) {
  return ((dispatch: any, getState: () => BsBrightSignPlayerState) => {
    dispatch(launchHSM());
  });
}

function launchHSM() {
  return ((dispatch: any) => {
    const _playerHSM = new PlayerHSM('playerHSM', startPlayback, restartPlayback, postMessage, queueHsmEvent);
    console.log(_playerHSM);
    // const action: any = _playerHSM.hsmInitialize().bind(_playerHSM);
    // dispatch(action).then(() => {
    //   const hsmInitializationComplete = hsmInitialized();
    //   console.log('69696969 - end of launchHSM, hsmInitializationComplete = ' + hsmInitializationComplete);
    // });
  });
}

function startPlayback() {

  return (dispatch: any, getState: any) => {
    console.log('startPlayback');
  };
}

function restartPlayback(presentationName: string): Promise<void> {
  return Promise.resolve();
}

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
