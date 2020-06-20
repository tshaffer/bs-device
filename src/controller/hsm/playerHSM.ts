
import { bspCreateHsm, bspInitializeHsm } from './hsm';
import { bspCreateHState } from './hState';
import { restartPlayback } from '../player';
import {
  // getHsmById,
  getHStateById
} from '../../selector/hsm';
import {
  BspHState,
  BspHsmType,
  BspStateType,
  ArEventType,
  HSMStateData,
  // BspHsm
 } from '../../type';
import { isNil } from 'lodash';
import { setHsmTop } from '../../model';
// import { DmState } from '@brightsign/bsdatamodel';

export const bspCreatePlayerHsm = (): any => {
  return ((dispatch: any, getState: any) => {
    console.log('invoke bspCreatePlayerHsm');
    dispatch(bspCreateHsm('player', BspHsmType.Player));

    dispatch(bspCreateHState('top', BspStateType.Top, 'player'));
    const stTop: BspHState | null = getHStateById(getState(), 'Top');
    const stTopId: string = isNil(stTop) ? '' : stTop.id;

    dispatch(setHsmTop('player', stTopId));

    dispatch(bspCreateHState('player', BspStateType.Player, 'player'));
    const stPlayer: BspHState | null = getHStateById(getState(), 'Player');
    if (!isNil(stPlayer)) {
      stPlayer.superStateId = stTopId;
    }

    dispatch(bspCreateHState('playing', BspStateType.Playing, 'player'));
    const stPlaying: BspHState | null = getHStateById(getState(), 'Playing');
    if (!isNil(stPlaying)) {
      stPlaying.superStateId = isNil(stPlayer) ? '' : stPlayer.id;
    }

    dispatch(bspCreateHState('waiting', BspStateType.Waiting, 'player'));
    const stWaiting: BspHState | null = getHStateById(getState(), 'Waiting');
    if (!isNil(stWaiting)) {
      stWaiting.superStateId = isNil(stPlayer) ? '' : stPlayer.id;
    }
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

export const STPlayerEventHandler = (
  hState: BspHState,
  event: ArEventType,
  stateData: HSMStateData
): any => {
  return (dispatch: any, getState: any) => {
    stateData.nextStateId = hState.superStateId;
    return 'SUPER';
  };
};

export const STPlayingEventHandler = (
  hState: BspHState,
  event: ArEventType,
  stateData: HSMStateData
): any => {

  return (dispatch: any, getState: any) => {
    stateData.nextStateId = null;

    console.log('***** - STPlayingEventHandler, event type ' + event.EventType);

    if (event.EventType && event.EventType === 'ENTRY_SIGNAL') {
      console.log(hState.id + ': entry signal');
      // const bsdm: DmState = getState().bsdm;
      return 'HANDLED';
    }

    stateData.nextStateId = hState.superStateId;
    return 'SUPER';
  };
};

export const STWaitingEventHandler = (
  hState: BspHState,
  event: ArEventType,
  stateData: HSMStateData
): any => {

  return (dispatch: any, getState: any) => {
    stateData.nextStateId = null;

    if (event.EventType && event.EventType === 'ENTRY_SIGNAL') {
      console.log(hState.id + ': entry signal');
      return 'HANDLED';
    } else if (event.EventType && event.EventType === 'TRANSITION_TO_PLAYING') {
      console.log(hState.id + ': TRANSITION_TO_PLAYING event received');
      // const hsmId: string = hState.hsmId;
      // const hsm: BspHsm = getHsmById(getState(), hsmId);
      const stPlayingState: BspHState | null = getHStateById(getState, 'Playing');
      if (!isNil(stPlayingState)) {
        stateData.nextStateId = stPlayingState.id;
        return 'TRANSITION';
      }
      debugger;
    }

    stateData.nextStateId = hState.superStateId;
    return 'SUPER';
  };
};
