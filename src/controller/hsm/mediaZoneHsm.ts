import { bspCreateZoneHsm } from './zoneHsm';
import {
  DmZone,
  dmGetMediaStateIdsForZone,
  dmFilterDmState,
  DmState,
  DmMediaState,
  dmGetMediaStateById,
  BsDmId,
  dmGetInitialMediaStateIdForZone,
  // dmGetInitialMediaStateIdForZone
} from '@brightsign/bsdatamodel';
import {
  HsmData, BsBspNonThunkAction,
  // MediaHState
} from '../../type';
import { ContentItemType } from '@brightsign/bscore';
import { bspCreateImageState } from './imageState';
import { isNil } from 'lodash';
import { BspHsm } from '../../type';
import { getHsmById } from '../../selector/hsm';

export const bspCreateMediaZoneHsm = (hsmId: string, hsmType: string, bsdmZone: DmZone): BsBspNonThunkAction => {
  return ((dispatch: any, getState: any) => {
    console.log('invoke bspCreateZoneHsm');

    const hsmData: HsmData = {
      zoneId: bsdmZone.id,
      x: bsdmZone.position.x,
      y: bsdmZone.position.y,
      height: bsdmZone.position.height,
      width: bsdmZone.position.width,
      initialMediaStateId: bsdmZone.initialMediaStateId
    };

    dispatch(bspCreateZoneHsm(hsmId, hsmType, hsmData));

    const bsdm: DmState = dmFilterDmState(getState());

    const mediaStateIds = dmGetMediaStateIdsForZone(bsdm, { id: bsdmZone.id });
    for (const mediaStateId of mediaStateIds) {
      const bsdmMediaState: DmMediaState = dmGetMediaStateById(bsdm, { id: mediaStateId }) as DmMediaState;
      dispatch(createMediaHState(hsmId, bsdmMediaState, ''));
    }
  });
};

const createMediaHState = (hsmId: string, bsdmMediaState: DmMediaState, superStateId: string): BsBspNonThunkAction => {

  return ((dispatch: any, getState: any) => {

    const contentItemType = bsdmMediaState.contentItem.type;
    switch (contentItemType) {
      case ContentItemType.Image:
        dispatch(bspCreateImageState(hsmId, bsdmMediaState, ''));
        break;
      case ContentItemType.Video:
        debugger;
        dispatch(bspCreateImageState(hsmId, bsdmMediaState, ''));
        break;
      default:
        break;
    }
  });
};

export const videoOrImagesZoneConstructor = (hsmId: string) => {
  return (dispatch: any, getState: any) => {

    // get the initial media state for the zone
    const bsdm: DmState = dmFilterDmState(getState());
    const hsm: BspHsm = getHsmById(getState(), hsmId);

    const initialMediaStateId: BsDmId | null =
      dmGetInitialMediaStateIdForZone(bsdm, { id: hsm.hsmData!.zoneId });
    if (!isNil(initialMediaStateId)) {
      const initialMediaState: DmMediaState = dmGetMediaStateById(bsdm, { id: initialMediaStateId }) as DmMediaState;
      console.log(initialMediaState);
    //   initialMediaState = this.getInitialState(bsdm, initialMediaState);
    //   for (const mediaHState of this.mediaHStates) {
    //     if (mediaHState.mediaState.id === initialMediaState.id) {
    //       this.activeState = mediaHState;
    //       return;
    //     }
    //   }
    }

    // // TEDTODO - verify that setting activeState to null is correct OR log error
    // this.activeState = null;

    return Promise.resolve();
  };
};
