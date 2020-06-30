import {
  ArEventType,
  HSMStateData,
  BspHState,
  BspStateType,
  BsBspDispatch,
} from '../../type';
import { isNil } from 'lodash';
import {
  STPlayerEventHandler,
  STPlayingEventHandler,
  STWaitingEventHandler,
  initializePlayerStateMachine,
} from './playerHSM';
import { videoOrImagesZoneConstructor, videoOrImagesZoneGetInitialState } from './mediaZoneHsm';
import { STImageStateEventHandler } from './imageState';

export const hsmConstructorFunction = (hsmId: string): any => {
  return (dispatch: BsBspDispatch) => {
    if (hsmId.indexOf('VideoOrImages') >= 0) {
      return dispatch(videoOrImagesZoneConstructor(hsmId));
    }
  };
};

export const bspInitialPseudoStateHandler = (hsmId: string) => {
  return (dispatch: BsBspDispatch) => {
    if (hsmId === 'player') {
      return dispatch(initializePlayerStateMachine());
    } else if (hsmId.indexOf('VideoOrImages') >= 0) {
      return dispatch(videoOrImagesZoneGetInitialState(hsmId));
    } else {
      debugger;
    }
  };
};

export const HStateEventHandler = (
  hState: BspHState,
  event: ArEventType,
  stateData: HSMStateData
): any => {
  return ((dispatch: BsBspDispatch) => {
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
        case BspStateType.Image:
          return dispatch(STImageStateEventHandler(hState, event, stateData));
        default:
          debugger;
          break;
      }
    }

    return null;
  });
};

const STTopEventHandler = (hState: BspHState, _: ArEventType, stateData: HSMStateData) => {
  return ((dispatch: BsBspDispatch) => {
    stateData.nextStateId = null;
    return 'IGNORED';
  });
};
