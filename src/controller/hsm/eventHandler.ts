import {
  ArEventType,
  // BsBspState,
  HSMStateData,
  // BspHsm,
  BspHState,
  BspStateType,
} from '../../type';
// import {
//   // getHsmById,
//   getHStateById
// } from '../../selector/hsm';
import { isNil } from 'lodash';
import { STPlayerEventHandler, STPlayingEventHandler, STWaitingEventHandler, initializePlayerStateMachine } from './playerHSM';

export const bspInitialPseudoStateHandler = (hsmId: string) => {
  return (dispatch: any, getState: any) => {
    if (hsmId === 'player') {
      return dispatch(initializePlayerStateMachine());
    }
  };
};

export const HStateEventHandler = (
  hState: BspHState,
  // state: BsBspState,
  // activeStateId: string,
  event: ArEventType,
  stateData: HSMStateData
): any => {
  return ((dispatch: any, getState: any) => {
    // const hState: BspHState | null = getHStateById(state, activeStateId);
    if (!isNil(hState)) {
      switch (hState.type) {
        case BspStateType.Top:
          return dispatch(STTopEventHandler(hState, event, stateData));
        case BspStateType.Player:
          return dispatch(STPlayerEventHandler(hState, event, stateData));
        case BspStateType.Playing:
          return dispatch(STPlayingEventHandler(hState, event, stateData));
        case BspStateType.Waiting:
          return dispatch(STWaitingEventHandler(hState, event, stateData));
        default:
          break;
      }
    }

    return null;
  });
};

const STTopEventHandler = (hState: BspHState, _: ArEventType, stateData: HSMStateData) => {
  return ((dispatch: any) => {
    stateData.nextStateId = null;
    return 'IGNORED';
  });
};
