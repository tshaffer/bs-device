import { Store } from 'redux';
import {
  BsBspState,
  BsBspVoidThunkAction,
  BsBspDispatch,
  ArEventType,
  HStateData,
  HSMStateData,
  MediaHState,
  BspHsm,
  MediaZoneHsmData,
  // HsmData,
} from '../../type';
import {
  DmState,
  dmGetEventIdsForMediaState,
  BsDmId,
  dmGetEventStateById,
  DmEvent,
  DmTimer,
  DmMediaState,
  DmcEvent,
  DmcMediaState,
  dmGetMediaStateById,
  dmFilterDmState,
  DmcTransition,
  DmSuperStateContentItem,
} from '@brightsign/bsdatamodel';
import {
  BspHState,
} from '../../type';
import { EventType, EventIntrinsicAction, ContentItemType } from '@brightsign/bscore';
import {
  setHStateData,
  // setHsmData
} from '../../model';
import {
  getHStateData, getHsmById,
  // getHsmById
} from '../../selector';
import { isNil } from 'lodash';
import {
  _bsBspStore,
  queueHsmEvent
} from '../playbackEngine';

export const mediaHStateEventHandler = (
  hState: BspHState,
  event: ArEventType,
  stateData: HSMStateData
): any => {

  return (dispatch: BsBspDispatch, getState: any) => {

    console.log('mediaHStateEventHandler');

    const mediaState: DmMediaState = dmGetMediaStateById(
      dmFilterDmState(getState()), { id: hState.id }) as DmMediaState;

    const matchedEvent: DmcEvent | null = getMatchedEvent(mediaState, event);

    if (!isNil(matchedEvent)) {
      return executeEventMatchAction(getState(), hState, matchedEvent, stateData);
    }

    stateData.nextStateId = hState.superStateId;
    return 'SUPER';
  };
};

const executeEventMatchAction = (
  state: BsBspState,
  hState: BspHState,
  event: DmcEvent,
  stateData: HSMStateData
): string => {
  if (isNil(event.transitionList) || event.transitionList.length === 0) {
    switch (event.action) {
      case EventIntrinsicAction.None: {
        console.log('remain on current state, playContinuous');
        return 'HANDLED';
      }
      case EventIntrinsicAction.ReturnToPriorState: {
        console.log('return prior state');
        /*
      nextStateId = ...previousStateId
      nextState = m.stateMachine.stateTable[nextState$]
      return 'TRANSITION'
        */
        return 'HANDLED';
      }
      default: {
        // AUTOTRONTODO
        debugger;
      }
    }
  } else {
    const transition: DmcTransition = event.transitionList[0]; // AUTOTRONTODO - or event.defaultTransition?
    const targetMediaStateId: BsDmId = transition.targetMediaStateId;
    const hsmId: string = hState.hsmId;
    const zoneHsm: BspHsm = getHsmById(state, hsmId);

    const mediaZoneHsmData: MediaZoneHsmData = zoneHsm.hsmData as MediaZoneHsmData;

    let targetHSMState: MediaHState = mediaZoneHsmData.mediaStateIdToHState[targetMediaStateId];
    if (!isNil(targetHSMState)) {

      // check to see if target of transition is a superState
      const targetMediaState: DmMediaState | null = dmGetMediaStateById(
        dmFilterDmState(state), { id: targetHSMState.id });
      if (!isNil(targetMediaState)) {
        if (targetMediaState.contentItem.type === ContentItemType.SuperState) {
          const superStateContentItem = targetMediaState.contentItem as DmSuperStateContentItem;
          const initialMediaStateId = superStateContentItem.initialMediaStateId;
          targetHSMState = mediaZoneHsmData.mediaStateIdToHState[initialMediaStateId];
        }
      } else {
        debugger;
      }

      stateData.nextStateId! = targetHSMState.id;
      return 'TRANSITION';
    }
  }
  return '';
};

const eventDataMatches = (matchedEvent: DmcEvent, dispatchedEvent: ArEventType): boolean => {
  return true;
};

const getMatchedEvent = (mediaState: DmMediaState, dispatchedEvent: ArEventType): DmcEvent | null => {
  const mediaStateEvents: DmcEvent[] = (mediaState as DmcMediaState).eventList;
  for (const mediaStateEvent of mediaStateEvents) {
    if (mediaStateEvent.type === dispatchedEvent.EventType) {
      if (eventDataMatches(mediaStateEvent, dispatchedEvent)) {
        return mediaStateEvent;
      }
    }
  }
  return null;
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

interface TimeoutEventCallbackParams {
  hState: BspHState;
  store: Store<BsBspState>;
}

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
          const timeoutEventCallbackParams: TimeoutEventCallbackParams = {
            hState,
            store: getState(),
          };
          const timeout = setTimeout(timeoutHandler, interval * 1000, timeoutEventCallbackParams);
          dispatch(setHStateData(hState.id, { timeout }));
        }
      }
    }
  };
};

const timeoutHandler = (callbackParams: TimeoutEventCallbackParams): void => {

  const event: ArEventType = {
    EventType: EventType.Timer,
  };

  console.log(event);
  console.log(callbackParams);

  // const { store } = callbackParams;
  // const hsmId = hState.hsmId;
  // const hsm = getHsmById(store.getState(), hsmId);
  // TEDTODO - circular reference?
  _bsBspStore.dispatch(queueHsmEvent(event));
};
