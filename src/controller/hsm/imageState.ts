import { DmMediaState } from '@brightsign/bsdatamodel';
import {
  BspHState,
  BspStateType,
  ArEventType,
  HSMStateData,
} from '../../type';
import { launchTimer, mediaHStateExitHandler, mediaHStateEventHandler } from '.';
import { bspCreateHState } from './hState';

export const bspCreateImageState = (
  hsmId: string,
  mediaState: DmMediaState,
  superStateId: string,
): any => {
  return ((dispatch: any) => {
    dispatch(bspCreateHState(
      mediaState.id,
      BspStateType.Image,
      hsmId,
      superStateId,
    ));
  });
};

export const STImageStateEventHandler = (
  hState: BspHState,
  event: ArEventType,
  stateData: HSMStateData
): any => {

  return (dispatch: any) => {

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
