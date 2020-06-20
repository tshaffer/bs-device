import { HSMStateData, BspHState, BspHsm } from '../../type/hsm';
import { isNil } from 'lodash';
import {
  ArEventType,
} from '../../type';
import { addHsm } from '../../model/hsm';
import { BsBspModelBaseAction, setActiveHState } from '../../model';

export const bspCreateHsm = (
  hsmId: string,
  hsmType: string,
) => {
  return ((dispatch: any) => {
    console.log('***** HSM.ts#bspCreateHsm');
    dispatch(addHsm({
      id: hsmId,
      type: hsmType,
      initialized: false,
      topStateId: '',
      activeStateId: null,
    }));
  });
};

export function bspInitializeHsm(
  hsmId: string,
  initialPseudoStateHandler: () => void,
): any {

  let activeState: BspHState | null = null;

  return ((dispatch: any) => {

    console.log('***** HSM.ts#bspInitializeHsm');

    // TEDTODO - don't return a new promsie
    return new Promise((resolve, reject) => {

      const hStateAction: BsBspModelBaseAction = setActiveHState(hsmId, null);
      dispatch(hStateAction);

      // execute initial transition
      if (!isNil(initialPseudoStateHandler)) {
        const action = initialPseudoStateHandler();

        dispatch(action).
          then((aState: any) => {
            activeState = aState; // TEDTODO - set it on redux here?
            const hsm = getHsmById(hsmId);
            hsm.activeStateId = (activeState as BspHState).id;
            const promise = dispatch(completeHsmInitialization(
              hsmId,
              getHState(hsm.activeStateId),
              getHState(hsm.topStateId),
              hsm.initialized
            ));
            promise.then(() => {
              const hsmInitializationComplete = hsmInitialized();
              console.log('69 - end of hsmInitialize-0, hsmInitializationComplete: ' + hsmInitializationComplete);
              return resolve();
            });
          });
      } else {
        // TEDTODO
        debugger;
        // const promise = dispatch(completeHsmInitialization(
        //   hsmId,
        //   activeStateId as string,
        //   topStateId,
        //   initialized));
        // promise.then(() => {
        //   const hsmInitializationComplete = hsmInitialized();
        //   console.log('969696969 - end of hsmInitialize-1, hsmInitializationComplete: ' + hsmInitializationComplete);
        //   return resolve();
        // });
      }
    });
  });
}

// TEDTODO - parameters - ids or objects or ??
function completeHsmInitialization(
  reduxHsmId: string,
  reduxActiveState: BspHState | null,
  reduxTopState: BspHState | null,
  reduxInitialized: boolean,
): any { // returns dispatch -> promise

  let action: any;

  return ((dispatch: any) => {

    return new Promise((resolve, reject) => {
      const stateData: HSMStateData = { nextStateId: null };

      // empty event used to get super states
      const emptyEvent: ArEventType = { EventType: 'EMPTY_SIGNAL' };

      // entry event
      const entryEvent: ArEventType = { EventType: 'ENTRY_SIGNAL' };

      // init event
      const initEvent: ArEventType = { EventType: 'INIT_SIGNAL' };

      // if there is no activeState, the playlist is empty
      if (isNil(reduxActiveState)) {
        dispatch(setActiveHState(reduxHsmId, null));
        console.log('***** return from HSM.ts#completeHsmInitialization');
        reduxInitialized = true;
        return resolve();
      }

      if (!isNil(reduxActiveState)) {
        let activeState: BspHState = reduxActiveState;

        // start at the top state
        if (isNil(reduxTopState)) {
          // TODO
          debugger;
        }
        let sourceState = reduxTopState;

        while (true) {

          const entryStates = [];
          let entryStateIndex = 0;

          // target of the initial transition
          entryStates[0] = activeState;

          // send an empty event to get the super state
          action = (reduxActiveState as any).HStateEventHandler(emptyEvent, stateData);
          status = dispatch(action);

          activeState = getHState(stateData.nextStateId) as BspHState;
          reduxActiveState = activeState;

          // walk up the tree until the current source state is hit
          while (activeState.id !== (sourceState as BspHState).id) {
            entryStateIndex = entryStateIndex + 1;
            entryStates[entryStateIndex] = activeState;
            action = (reduxActiveState as any).HStateEventHandler(emptyEvent, stateData);
            status = dispatch(action);
            activeState = getHState(stateData.nextStateId) as BspHState;
            reduxActiveState = activeState;
          }

          // restore the target of the initial transition
          // activeState = entryStates[0];

          // retrace the entry path in reverse (desired) order
          while (entryStateIndex >= 0) {
            const entryState = entryStates[entryStateIndex];
            action = (entryState as any).HStateEventHandler(entryEvent, stateData);
            status = dispatch(action);
            entryStateIndex = entryStateIndex - 1;
          }

          // new source state is the current state
          sourceState = entryStates[0];

          // console.log('HSM.ts#initialize: invoke handler with initEvent');
          // console.log(sourceState.id);

          action = (sourceState as any).HStateEventHandler(initEvent, stateData);
          status = dispatch(action);
          if (status !== 'TRANSITION') {
            reduxActiveState = sourceState;
            dispatch(setActiveHState(reduxHsmId, reduxActiveState));
            console.log('***** return from HSM.ts#completeHsmInitialization');
            console.log(self);
            reduxInitialized = true;
            return resolve();
          }

          activeState = getHState(stateData.nextStateId);
          reduxActiveState = activeState;
        }
      }
    });
  });
}

export function constructorFunction(constructorHandler: () => void): void {
  if (!isNil(constructorHandler)) {
    constructorHandler();
  }
}

export function hsmDispatch(
  event: ArEventType,
  reduxHsmId: string,
  reduxActiveStateId: string,
) {

  /* redux items? */
  let reduxActiveState: BspHState | null = getHState(reduxActiveStateId);

  let action: any;
  let status: string;

  return ((dispatch: any, getState: () => any) => {

    console.log('***** HSM.ts#Dispatch');
    console.log(event.EventType);

    // if there is no activeState, the playlist is empty
    if (reduxActiveState == null) {
      dispatch(setActiveHState(reduxHsmId, reduxActiveState));
      return;
    }

    const stateData: HSMStateData = { nextStateId: null };

    // empty event used to get super states
    const emptyEvent: ArEventType = { EventType: 'EMPTY_SIGNAL' };

    // entry event
    const entryEvent: ArEventType = { EventType: 'ENTRY_SIGNAL' };

    // init event
    const initEvent: ArEventType = { EventType: 'INIT_SIGNAL' };

    // exit event
    const exitEvent: ArEventType = { EventType: 'EXIT_SIGNAL' };

    let t = reduxActiveState;                                                      // save the current state

    status = 'SUPER';
    let s: BspHState = reduxActiveState as BspHState; // TODO - initialized to reduce ts errors. TEDTODO - legit?
    while (status === 'SUPER') {                                                 // process the event hierarchically
      s = reduxActiveState as BspHState;
      action = (s as any).HStateEventHandler(event, stateData);
      status = dispatch(action);
      reduxActiveState = getHState(stateData.nextStateId);
    }

    if (status === 'TRANSITION') {
      const path = [];

      path[0] = reduxActiveState;                                                // save the target of the transition
      path[1] = t;                                                            // save the current state

      // exit from the current state to the transition s
      while (t.id !== s.id) {
        action = (t as any).HStateEventHandler(exitEvent, stateData);
        status = dispatch(action);
        if (status === 'HANDLED') {
          action = (t as any).HStateEventHandler(emptyEvent, stateData);
          status = dispatch(action);
        }
        t = getHState(stateData.nextStateId) as BspHState;
      }

      t = path[0] as BspHState;                                                            // target of the transition

      // s is the source of the transition
      let ip: number = -1; // TEDTODO - initialization legit?
      // check source == target (transition to self)
      if (s.id === t.id) {
        action = (s as any).HStateEventHandler(exitEvent, stateData);                // exit the source
        status = dispatch(action);
        ip = 0;
      } else {
        action = (t as any).HStateEventHandler(emptyEvent, stateData);               // superstate of target
        status = dispatch(action);
        t = getHState(stateData.nextStateId) as BspHState;
        if (s.id === t.id) {                                                 // check source == target->super
          ip = 0;                                                         // enter the target
        } else {
          action = (s as any).HStateEventHandler(emptyEvent, stateData);           // superstate of source
          status = dispatch(action);

          // check source->super == target->super
          if ((getHState(stateData.nextStateId) as BspHState).id === t.id) {
            action = (s as any).HStateEventHandler(exitEvent, stateData);        // exit the source
            status = dispatch(action);
            ip = 0;                                                     // enter the target
          } else {
            if ((getHState(stateData.nextStateId) as BspHState).id === (path as BspHState[])[0].id) {
              // check source->super == target
              action = (s as any).HStateEventHandler(exitEvent, stateData);    // exit the source
              status = dispatch(action);
            } else {
              let iq = 0;                                             // indicate LCA not found
              ip = 1;                                                 // enter target and its superstate
              path[1] = t;                                            // save the superstate of the target
              t = getHState(stateData.nextStateId) as BspHState;                                // save source->super
              // get target->super->super
              const aState: any = (path as BspHState[])[1];
              action = aState.HStateEventHandler(emptyEvent, stateData);
              status = dispatch(action);
              while (status === 'SUPER') {
                ip = ip + 1;
                path[ip] = getHState(stateData.nextStateId);                     // store the entry path
                if ((getHState(stateData.nextStateId) as BspHState).id === s.id) {                // is it the source?
                  iq = 1;                                         // indicate that LCA found
                  ip = ip - 1;                                    // do not enter the source
                  status = 'HANDLED';                             // terminate the loop
                } else {                                              // it is not the source; keep going up
                  const bState: any = (getHState(stateData.nextStateId) as BspHState);
                  action = bState.HStateEventHandler(emptyEvent, stateData);
                  status = dispatch(action);
                }
              }

              if (iq === 0) {                                           // LCA not found yet
                action = (s as any).HStateEventHandler(exitEvent, stateData); // exit the source
                status = dispatch(action);

                // check the rest of source->super == target->super->super...
                iq = ip;
                status = 'IGNORED';                                 // indicate LCA not found
                while (iq >= 0) {
                  if (t.id === (path as BspHState[])[iq].id) {                      // is this the LCA?
                    status = 'HANDLED';                         // indicate LCA found
                    ip = iq - 1;                                // do not enter LCA
                    iq = -1;                                    // terminate the loop
                  } else {
                    iq = iq - 1;                                 // try lower superstate of target
                  }
                }

                if (status !== 'HANDLED') {                          // LCA not found yet?

                  // check each source->super->... for each target->super...
                  status = 'IGNORED';                             // keep looping
                  while (status !== 'HANDLED') {
                    action = (t as any).HStateEventHandler(exitEvent, stateData);
                    status = dispatch(action);
                    if (status === 'HANDLED') {
                      action = (t as any).HStateEventHandler(emptyEvent, stateData);
                      status = dispatch(action);
                    }
                    t = getHState(stateData.nextStateId) as BspHState;                    // set to super of t
                    iq = ip;
                    while (iq > 0) {
                      if (t.id === (path as BspHState[])[iq].id) {              // is this the LCA?
                        ip = iq - 1;                        // do not enter LCA
                        iq = -1;                            // break inner
                        status = 'HANDLED';                 // break outer
                      } else {
                        iq = iq - 1;
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }

      // retrace the entry path in reverse (desired) order...
      while (ip >= 0) {
        const cState: any = (path as BspHState[])[ip];
        action = cState.HStateEventHandler(entryEvent, stateData);        // enter path[ip]
        status = dispatch(action);
        ip = ip - 1;
      }

      // stick the target into register */
      t = (path as BspHState[])[0];
      reduxActiveState = t;                                                   // update the current state */

      // console.log('HSM.ts#Dispatch: invoke handler with initEvent');

      // drill into the target hierarchy...
      action = (t as any).HStateEventHandler(initEvent, stateData);
      status = dispatch(action);
      reduxActiveState = getHState(stateData.nextStateId);

      while (status === 'TRANSITION') {
        ip = 0;
        path[0] = reduxActiveState;
        action = (reduxActiveState as BspHState as any)
          .HStateEventHandler(emptyEvent, stateData); // find superstate
        status = dispatch(action);
        reduxActiveState = getHState(stateData.nextStateId);
        while ((reduxActiveState as BspHState).id !== t.id) {
          ip = ip + 1;
          path[ip] = reduxActiveState;
          action = (reduxActiveState as BspHState as any)
            .HStateEventHandler(emptyEvent, stateData); // find superstate
          status = dispatch(action);
          reduxActiveState = getHState(stateData.nextStateId);
        }
        reduxActiveState = path[0];

        while (ip >= 0) {
          const dState: any = (path as BspHState[])[ip];
          action = dState.HStateEventHandler(entryEvent, stateData);
          status = dispatch(action);
          ip = ip - 1;
        }

        t = (path as BspHState[])[0];

        action = (t as any).HStateEventHandler(initEvent, stateData);
        status = dispatch(action);
      }
    }

    // set the new state or restore the current state
    reduxActiveState = t;

    dispatch(setActiveHState(reduxHsmId, reduxActiveState));
  });
}

// TEDTODO
function getHState(hStateId: string | null): any {
  return null;
}

// TEDTODO
function hsmInitialized(): boolean {
  return false;
}

// TEDTODO
// this should be in the selectors
const getHsmById = (hsmId: string): BspHsm => {
  return {
    id: hsmId,
    type: '',
    topStateId: '',
    activeStateId: '',
    initialized: false,
  };
};
