import { DmMediaState } from '@brightsign/bsdatamodel';
import {
  BspHState,
  BspStateType,
  ArEventType,
  HSMStateData,
  BsBspDispatch,
  BsBspVoidThunkAction,
} from '../../type';
import { launchTimer, mediaHStateExitHandler, mediaHStateEventHandler } from '.';
import { bspCreateHState } from './hState';

export const bspCreateImageState = (
  hsmId: string,
  mediaState: DmMediaState,
  superStateId: string,
): BsBspVoidThunkAction => {
  return ((dispatch: BsBspDispatch) => {
    dispatch(bspCreateHState(
      BspStateType.Image,
      hsmId,
      superStateId,
      {
        mediaStateId: mediaState.id,
      },
    ));
  });
};

export const STImageStateEventHandler = (
  hState: BspHState,
  event: ArEventType,
  stateData: HSMStateData
): BsBspVoidThunkAction => {
  return (dispatch: BsBspDispatch) => {
    if (event.EventType === 'ENTRY_SIGNAL') {
      console.log('STImageStateEventHandler: entry signal');
      dispatch(launchTimer(hState));
      return 'HANDLED';
    } else if (event.EventType === 'EXIT_SIGNAL') {
      dispatch(mediaHStateExitHandler(hState.id));
      stateData.nextStateId = hState.superStateId;
      return 'SUPER';
    } else {
      return dispatch(mediaHStateEventHandler(hState, event, stateData));
    }
  };
};
