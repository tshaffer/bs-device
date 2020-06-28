import {
  BsBspVoidThunkAction,
  BsBspDispatch,
  ArEventType,
  HStateData,
  HSMStateData,
} from '../../type';
import {
  DmState,
  dmGetEventIdsForMediaState,
  BsDmId,
  dmGetEventStateById,
  DmEvent,
  DmTimer,
} from '@brightsign/bsdatamodel';
import {
  BspHState,
} from '../../type';
import { EventType } from '@brightsign/bscore';
import { setHStateData } from '../../model';
import { getHStateData } from '../../selector';
import { isNil } from 'lodash';

export const mediaHStateEventHandler = (
  hState: BspHState,
  event: ArEventType,
  stateData: HSMStateData
): any => {

  return (dispatch: BsBspDispatch) => {
    console.log('mediaHStateEventHandler');
    stateData.nextStateId = hState.superStateId;
    return 'SUPER';
  };
};

export const mediaHStateExitHandler = (
  hStateId: string,
): BsBspVoidThunkAction => {

  return (dispatch: BsBspDispatch, getState: any) => {
    console.log('mediaHStateExitHandler');
    const hStateData: HStateData | null = getHStateData(getState(), hStateId);
    if (!isNil(hStateData) && !isNil(hStateData.timeout)) {
      clearTimeout(hStateData.timeout);
      // TODO - this may fail - dispatching an action inside of a whatever
      dispatch(setHStateData(hStateId, { timeout: null }));
    }
  };
};

export const launchTimer = (
  hState: BspHState,
): any => {

  return (dispatch: any, getState: any) => {

    // at least part of this will move somwhere else
    const bsdm: DmState = getState().bsdm;

    const eventIds: BsDmId[] = dmGetEventIdsForMediaState(bsdm, { id: hState.id });
    for (const eventId of eventIds) {
      const event: DmEvent = dmGetEventStateById(bsdm, { id: eventId }) as DmEvent;
      if (event.type === EventType.Timer) {
        const interval: number = (event.data as DmTimer).interval;
        if (interval && interval > 0) {
          const timeout = setTimeout(timeoutHandler, interval * 1000, hState.id);
          dispatch(setHStateData(hState.id, { timeout }));
        }
      }
    }
  };
};

const timeoutHandler = (mediaHState: any): void => {

  const event: ArEventType = {
    EventType: EventType.Timer,
  };

  console.log(event);
  // const reduxStore: any = getReduxStore();
  // reduxStore.dispatch(mediaHState.stateMachine.dispatchEvent(event));
};
