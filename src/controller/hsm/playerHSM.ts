
import {
  bspCreateHsm,
  bspInitializeHsm
} from './hsm';
import { bspCreateHState } from './hState';
import {
  restartPlayback,
  startPlayback,
} from '../playbackEngine';
import {
  getHsmByName,
  getHStateByName,
} from '../../selector/hsm';
import {
  BspHState,
  BspHsmType,
  BspStateType,
  ArEventType,
  HSMStateData,
  BsBspAnyPromiseThunkAction,
  // BspHsm
} from '../../type';
import { isNil } from 'lodash';
import { setHsmTop } from '../../model';
// import { DmState } from '@brightsign/bsdatamodel';

export const bspCreatePlayerHsm = (): any => {
  return ((dispatch: any, getState: any) => {
    console.log('invoke bspCreatePlayerHsm');
    const playerHsmId: string = dispatch(bspCreateHsm('player', BspHsmType.Player));

    dispatch(bspCreateHState(
      BspStateType.Top,
      'player',
      '',
      {
        name: 'top',
      }));
    const stTop: BspHState | null = getHStateByName(getState(), 'top');
    const stTopId: string = isNil(stTop) ? '' : stTop.id;

    dispatch(setHsmTop(playerHsmId, stTopId));

    dispatch(bspCreateHState(BspStateType.Player, playerHsmId, stTopId, {
      name: 'player',
    }));
    const stPlayer: BspHState = getHStateByName(getState(), 'player') as BspHState;

    dispatch(bspCreateHState(BspStateType.Playing, playerHsmId, stPlayer.id, {
      name: 'playing',
    }));

    dispatch(bspCreateHState(BspStateType.Waiting, playerHsmId, stPlayer.id, {
      name: 'waiting',
    }));
  });
};

export const bspInitializePlayerHsm = (): any => {
  return ((dispatch: any, getState: any) => {
    console.log('invoke bspInitializePlayerHsm');
    const playerHsm = getHsmByName(getState(), 'player');
    if (!isNil(playerHsm)) {
      dispatch(bspInitializeHsm(
        playerHsm.id,
        initializePlayerStateMachine));
    }
  });
};

export const initializePlayerStateMachine = (): BsBspAnyPromiseThunkAction => {
  return (dispatch: any, getState: any) => {
    console.log('invoke initializePlayerStateMachine');

    // TEDTODO - HOW TO GET restartPlayback here?
    // it should be stored, though not as a function, in redux
    return dispatch(restartPlayback(''))
      .then(() => {
        console.log('return from invoking playerStateMachine restartPlayback');
        return Promise.resolve(getHStateByName(getState(), 'playing'));
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

    console.log('***** - STPlayerEventHandler, event type ' + event.EventType);

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

      const action: any = startPlayback();
      dispatch(action);

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
      const stPlayingState: BspHState | null = getHStateByName(getState, 'Playing');
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
