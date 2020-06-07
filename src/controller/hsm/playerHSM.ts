import { HSM, HState, STTopEventHandler } from './HSM';
import { ArEventType, HSMStateData } from '../../type/runtime';
import { Action } from 'redux';
import { DmState } from '@brightsign/bsdatamodel';
import {
  BsDmId,
  DmDataFeedSource,
  dmGetDataFeedIdsForSign,
  DmcDataFeed,
  dmGetDataFeedById,
  dmGetDataFeedSourceForFeedId
} from '@brightsign/bsdatamodel';
import { isNil, isString } from 'lodash';

import {
  downloadMRSSFeedContent,
  retrieveDataFeed,
  readCachedFeed,
  downloadContentFeedContent,
  processFeed
} from '../dataFeed';
import { DataFeedUsageType } from '@brightsign/bscore';
import { ArContentFeed, ArMrssFeed, ArDataFeed } from '../../type/dataFeed';
import { getDataFeedById } from '../../selector/dataFeed';

export class PlayerHSM extends HSM {

  type: string;
  stTop: HState;
  stPlayer: HState;
  stPlaying: HState;
  stWaiting: HState;

  startPlayback: () => any;
  restartPlayback: (presentationName: string) => Promise<void>;
  postMessage: (event: any) => Action;

  constructor(
    hsmId: string,
    startPlayback: () => any,
    restartPlayback: (presentationName: string) => Promise<void>,
    postMessage: (event: ArEventType) => any, // TODO
    dispatchEvent: any) {

    super(hsmId, dispatchEvent);

    this.type = 'player';

    this.stTop = new HState(this, 'Top');
    this.stTop.HStateEventHandler = STTopEventHandler;

    this.initialPseudoStateHandler = this.initializePlayerStateMachine;

    this.stPlayer = new STPlayer(this, 'Player', this.stTop);
    this.stPlaying = new STPlaying(this, 'Playing', this.stPlayer);
    this.stWaiting = new STWaiting(this, 'Waiting', this.stPlayer);

    this.topState = this.stTop;

    this.startPlayback = startPlayback;
    this.restartPlayback = restartPlayback;
    this.postMessage = postMessage;
  }

  initializePlayerStateMachine(): any {
    return (dispatch: any) => {
      return this.restartPlayback('')
        .then(() => {
          return Promise.resolve(this.stPlaying);
        });
    };
  }
}

class STPlayer extends HState {

  constructor(stateMachine: PlayerHSM, id: string, superState: HState) {

    super(stateMachine, id);

    this.HStateEventHandler = this.STPlayerEventHandler;
    this.superState = superState;
  }

  STPlayerEventHandler(event: ArEventType, stateData: HSMStateData): any {

    return (dispatch: any) => {
      stateData.nextState = null;

      stateData.nextState = this.superState;
      return 'SUPER';
    };
  }
}

class STPlaying extends HState {

  // ids of dataFeeds to download
  bsdmDataFeedIdsToDownload: BsDmId[] = [];

  constructor(stateMachine: PlayerHSM, id: string, superState: HState) {
    super(stateMachine, id);

    this.HStateEventHandler = this.STPlayingEventHandler;
    this.superState = superState;
  }

  advanceToNextDataFeedInQueue(bsdm: DmState) {
    return (dispatch: any, getState: any) => {
      this.bsdmDataFeedIdsToDownload.shift();

      if (this.bsdmDataFeedIdsToDownload.length > 0) {
        const bsdmDataFeedId = this.bsdmDataFeedIdsToDownload[0];
        dispatch(this.retrieveAndProcessDataFeed(bsdm, bsdmDataFeedId));
      }
    };
  }

  queueRetrieveDataFeed(bsdm: DmState, bsdmDataFeedId: BsDmId) {
    return (dispatch: any, getState: any) => {
      const bsdmDataFeed: DmcDataFeed | null = dmGetDataFeedById(bsdm, { id: bsdmDataFeedId }) as DmcDataFeed;
      if (!isNil(bsdmDataFeed)) {
        if (bsdmDataFeed.usage === DataFeedUsageType.Text) {
          dispatch(this.retrieveAndProcessDataFeed(bsdm, bsdmDataFeedId));
        } else {
          this.bsdmDataFeedIdsToDownload.push(bsdmDataFeedId);
          if (this.bsdmDataFeedIdsToDownload.length === 1) {
            dispatch(this.retrieveAndProcessDataFeed(bsdm, bsdmDataFeedId));
          }
        }
      }
    };
  }

  launchRetrieveFeedTimer(dataFeedId: BsDmId, bsdm: DmState): any {
    return (dispatch: any, getState: any) => {

      const dataFeedSource = dmGetDataFeedSourceForFeedId(bsdm, { id: dataFeedId }) as DmDataFeedSource;
      let updateInterval = dataFeedSource.updateInterval;

      // test
      updateInterval = 60;

      setTimeout(this.retrieveFeedTimeoutHandler.bind(this), updateInterval * 1000, dispatch, this, dataFeedId, bsdm);
    };
  }

  retrieveFeedTimeoutHandler(dispatch: any, playerHSM: PlayerHSM, dataFeedId: BsDmId, bsdm: DmState): any {
    dispatch(this.queueRetrieveDataFeed(bsdm, dataFeedId));
  }

  STPlayingEventHandler(event: ArEventType, stateData: HSMStateData): any {

    return (dispatch: any, getState: any) => {
      stateData.nextState = null;

      console.log('***** - STPlayingEventHandler, event type ' + event.EventType);

      if (event.EventType && event.EventType === 'ENTRY_SIGNAL') {

        console.log(this.id + ': entry signal');

        const bsdm: DmState = getState().bsdm;

        const readStoredFeedsAction: any = this.readCachedFeeds(bsdm);
        dispatch(readStoredFeedsAction)
          .then(() => {
            dispatch(this.fetchFeeds(bsdm));
            const action: any = (this.stateMachine as PlayerHSM).startPlayback();
            dispatch(action);
            return 'HANDLED';
          });
      } else if (isString(event.EventType) && (event.EventType === 'MRSS_DATA_FEED_LOADED') || (event.EventType === 'CONTENT_DATA_FEED_LOADED') || (event.EventType === 'CONTENT_DATA_FEED_UNCHANGED')) {
        console.log('******* - cc30');
        dispatch(this.advanceToNextDataFeedInQueue(getState().bsdm).bind(this));
        return 'HANDLED';
      }

      stateData.nextState = this.superState;
      return 'SUPER';
    };
  }

  readCachedFeeds(bsdm: DmState) {

    return (dispatch: any) => {

      const bsdmDataFeedIds: BsDmId[] = dmGetDataFeedIdsForSign(bsdm);

      const readNextCachedFeed = (index: number): Promise<void> => {

        if (index >= bsdmDataFeedIds.length) {
          return Promise.resolve();
        }

        const bsdmDataFeedId = bsdmDataFeedIds[index];
        const bsdmDataFeed: DmcDataFeed | null = dmGetDataFeedById(bsdm, { id: bsdmDataFeedId }) as DmcDataFeed;
        return (readCachedFeed(bsdmDataFeed))
          .then((rawFeed: any) => {
            if (!isNil(rawFeed)) {
              // const promise = dispatch(processFeed(bsdmDataFeed, rawFeed));
              dispatch(processFeed(bsdmDataFeed, rawFeed));
              // TODO - wait for promise to get resolved before starting next one?
            }
            return readNextCachedFeed(index + 1);
          }).catch((error: Error) => {
            console.log(error);
            debugger;
          });
      };

      return readNextCachedFeed(0);
    };
  }

  fetchFeeds(bsdm: DmState) {
    return (dispatch: any, getState: any) => {
      const bsdmDataFeedIds: BsDmId[] = dmGetDataFeedIdsForSign(bsdm);
      for (const bsdmDataFeedId of bsdmDataFeedIds) {
        dispatch(this.queueRetrieveDataFeed(bsdm, bsdmDataFeedId));
      }
    };
  }

  retrieveAndProcessDataFeed(bsdm: DmState, bsdmDataFeedId: BsDmId) {
    return (dispatch: any, getState: any) => {
      const bsdmDataFeed: DmcDataFeed | null = dmGetDataFeedById(bsdm, { id: bsdmDataFeedId }) as DmcDataFeed;
      // const feedFileName: string = getFeedCacheRoot() + bsdmDataFeed.id + '.xml';
      retrieveDataFeed(bsdm, bsdmDataFeed)
        .then((rawFeed) => {
          dispatch(processFeed(bsdmDataFeed, rawFeed))
            .then(() => {
              // TYPESCRIPT issues
              const arDataFeed = getDataFeedById(getState(), bsdmDataFeed.id) as ArDataFeed;
              if (arDataFeed.type === 'content') {
                dispatch(downloadContentFeedContent(arDataFeed as ArContentFeed));
              } else if (arDataFeed.type === 'mrss') {
                dispatch(downloadMRSSFeedContent(arDataFeed as ArMrssFeed));
              } else if (arDataFeed.type === 'text') {
                console.log('text feed: return from processFeed - no content to download');
              } else {
                debugger;
              }

              const event: ArEventType = {
                EventType: 'LIVE_DATA_FEED_UPDATE',
                EventData: bsdmDataFeedId,
              };
              const action: any = (this.stateMachine as PlayerHSM).postMessage(event);
              dispatch(action);

              dispatch(this.launchRetrieveFeedTimer(bsdmDataFeedId, bsdm).bind(this));

            }).catch((err: any) => {
              console.log(err);
            });
        });
    };
  }

}

class STWaiting extends HState {

  constructor(stateMachine: PlayerHSM, id: string, superState: HState) {
    super(stateMachine, id);

    this.HStateEventHandler = this.STWaitingEventHandler;
    this.superState = superState;
  }

  STWaitingEventHandler(event: ArEventType, stateData: HSMStateData): any {

    return (dispatch: any) => {
      stateData.nextState = null;

      if (event.EventType && event.EventType === 'ENTRY_SIGNAL') {
        console.log(this.id + ': entry signal');
        return 'HANDLED';
      } else if (event.EventType && event.EventType === 'TRANSITION_TO_PLAYING') {
        console.log(this.id + ': TRANSITION_TO_PLAYING event received');
        stateData.nextState = (this.stateMachine as PlayerHSM).stPlaying;
        return 'TRANSITION';
      }

      stateData.nextState = this.superState;
      return 'SUPER';
    };
  }
}

