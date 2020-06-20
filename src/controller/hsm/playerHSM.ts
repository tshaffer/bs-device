
import { bspCreateHsm, bspInitializeHsm } from './hsm';
import { bspCreateHState } from './hState';
import { restartPlayback } from '../player';
import { getHStateById } from '../../selector/hsm';

export const bspCreatePlayerHsm = (): any => {
  return ((dispatch: any) => {
    console.log('invoke bspCreatePlayerHsm');
    dispatch(bspCreateHsm('player', 'player'));
    dispatch(bspCreateHState('Top', 'player'));

    dispatch(bspCreateHState('Player', 'player'));
    dispatch(bspCreateHState('Playing', 'player'));
    dispatch(bspCreateHState('Waiting', 'player'));
  });
};

export const bspInitializePlayerHsm = (): any => {
  return ((dispatch: any) => {
    console.log('invoke bspInitializePlayerHsm');
    dispatch(bspInitializeHsm(
      'player',
      initializePlayerStateMachine));
  });
};

const initializePlayerStateMachine = (): any => {
  return (dispatch: any, getState: any) => {
    console.log('invoke initializePlayerStateMachine');

    // TEDTODO - BIG
    // HOW TO GET restartPlayback here?
    // it should be stored, though not as a function, in redux
    return restartPlayback('')

      .then(() => {
        console.log('return from invoking playerStateMachine restartPlayback');
        return Promise.resolve(getHStateById(getState(), 'Playing'));
    //     return Promise.resolve(this.stPlaying);
      });
  };
};

// export class PlayerHSM extends BsHSM {

//   type: string;
//   stTop: HState;
//   stPlayer: HState;
//   stPlaying: HState;
//   stWaiting: HState;

//   startPlayback: () => any;
//   restartPlayback: (presentationName: string) => Promise<void>;
//   postMessage: (event: any) => Action;

//   constructor(
//     hsmId: string,
//     startPlayback: () => any,
//     restartPlayback: (presentationName: string) => Promise<void>,
//     postMessage: (event: ArEventType) => any, // TODO
//     dispatchEvent: any) {

//     super(hsmId, dispatchEvent);

//     this.type = 'player';

//     this.stTop = new BsHState(this, 'Top');
//     this.stTop.HStateEventHandler = STTopEventHandler;

//     this.initialPseudoStateHandler = this.initializePlayerStateMachine;

//     this.stPlayer = new STPlayer(this, 'Player', this.stTop);
//     this.stPlaying = new STPlaying(this, 'Playing', this.stPlayer);
//     this.stWaiting = new STWaiting(this, 'Waiting', this.stPlayer);

//     this.topState = this.stTop;

//     this.startPlayback = startPlayback;
//     this.restartPlayback = restartPlayback;
//     this.postMessage = postMessage;
//   }

//   initializePlayerStateMachine(): any {
//     return (dispatch: any) => {
//       return this.restartPlayback('')
//         .then(() => {
//           return Promise.resolve(this.stPlaying);
//         });
//     };
//   }
// }

// class STPlayer extends BsHState {

//   constructor(stateMachine: PlayerHSM, id: string, superState: HState) {

//     super(stateMachine, id);

//     this.HStateEventHandler = this.STPlayerEventHandler;
//     this.superState = superState;
//   }

//   STPlayerEventHandler(event: ArEventType, stateData: HSMStateData): any {

//     return (dispatch: any) => {
//       stateData.nextStateId = null;

//       stateData.nextStateId = this.superState;
//       return 'SUPER';
//     };
//   }
// }

// class STPlaying extends BsHState {

//   constructor(stateMachine: PlayerHSM, id: string, superState: HState) {
//     super(stateMachine, id);

//     this.HStateEventHandler = this.STPlayingEventHandler;
//     this.superState = superState;
//   }

//   STPlayingEventHandler(event: ArEventType, stateData: HSMStateData): any {

//     return (dispatch: any, getState: any) => {
//       stateData.nextStateId = null;

//       console.log('***** - STPlayingEventHandler, event type ' + event.EventType);
//       stateData.nextStateId = this.superState;
//       return 'SUPER';
//     };
//   }

// }

// class STWaiting extends BsHState {

//   constructor(stateMachine: PlayerHSM, id: string, superState: HState) {
//     super(stateMachine, id);

//     this.HStateEventHandler = this.STWaitingEventHandler;
//     this.superState = superState;
//   }

//   STWaitingEventHandler(event: ArEventType, stateData: HSMStateData): any {

//     return (dispatch: any) => {
//       stateData.nextStateId = null;

//       if (event.EventType && event.EventType === 'ENTRY_SIGNAL') {
//         console.log(this.id + ': entry signal');
//         return 'HANDLED';
//       } else if (event.EventType && event.EventType === 'TRANSITION_TO_PLAYING') {
//         console.log(this.id + ': TRANSITION_TO_PLAYING event received');
//         stateData.nextStateId = (this.stateMachine as PlayerHSM).stPlaying;
//         return 'TRANSITION';
//       }

//       stateData.nextStateId = this.superState;
//       return 'SUPER';
//     };
//   }
// }
