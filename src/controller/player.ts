import { Store } from 'redux';
import { BsBrightSignPlayerState } from '../type/base';
// import { HSM } from '../type';

// let _hsmList: HSM[] = [];

export function initPlayer(store: Store<BsBrightSignPlayerState>) {
  return ((dispatch: any, getState: () => BsBrightSignPlayerState) => {
    return null;
  });
}

// function launchHSM() {
//   return ((dispatch: any) => {
//     // _playerHSM = new PlayerHSM('playerHSM', startPlayback, restartPlayback, postMessage, queueHsmEvent);
//     // const action: any = _playerHSM.hsmInitialize().bind(_playerHSM);
//     // dispatch(action).then(() => {
//     //   const hsmInitializationComplete = hsmInitialized();
//     //   console.log('69696969 - end of launchHSM, hsmInitializationComplete = ' + hsmInitializationComplete);
//     // });
//   });
// }
