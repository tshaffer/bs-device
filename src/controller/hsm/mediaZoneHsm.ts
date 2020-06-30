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
  // HsmData,
  MediaZoneHsmData,
  BspHState,
  BsBspVoidThunkAction,
  // MediaHState
} from '../../type';
import { ContentItemType } from '@brightsign/bscore';
import { bspCreateImageState } from './imageState';
import { isNil } from 'lodash';
import { BspHsm } from '../../type';
import { getHsmById, getHStateById } from '../../selector/hsm';
import { setActiveHState, setHsmData } from '../../model';

export const bspCreateMediaZoneHsm = (hsmId: string, hsmType: string, bsdmZone: DmZone): BsBspVoidThunkAction => {
  return ((dispatch: any, getState: any) => {
    console.log('invoke bspCreateZoneHsm');

    const hsmData: MediaZoneHsmData = {
      zoneId: bsdmZone.id,
      x: bsdmZone.position.x,
      y: bsdmZone.position.y,
      height: bsdmZone.position.height,
      width: bsdmZone.position.width,
      initialMediaStateId: bsdmZone.initialMediaStateId,
      mediaStateIdToHState: {},
    };

    dispatch(bspCreateZoneHsm(hsmId, hsmType, hsmData));

    const bsdm: DmState = dmFilterDmState(getState());

    const mediaStateIds = dmGetMediaStateIdsForZone(bsdm, { id: bsdmZone.id });
    for (const mediaStateId of mediaStateIds) {
      const bsdmMediaState: DmMediaState = dmGetMediaStateById(bsdm, { id: mediaStateId }) as DmMediaState;
      dispatch(createMediaHState(hsmId, bsdmMediaState, ''));
      const hState: BspHState | null = getHStateById(getState(), bsdmMediaState.id);
      if (!isNil(hState)) {
        hsmData.mediaStateIdToHState[bsdmMediaState.id] = hState;
        dispatch(setHsmData(hsmId, hsmData));
      }
    }
  });
};

const createMediaHState = (hsmId: string, bsdmMediaState: DmMediaState, superStateId: string): BsBspVoidThunkAction => {

  return ((dispatch: any, getState: any) => {

    const hsm: BspHsm = getHsmById(getState(), hsmId);
    if (!isNil(hsm)) {
      const contentItemType = bsdmMediaState.contentItem.type;
      switch (contentItemType) {
        case ContentItemType.Image:
          dispatch(bspCreateImageState(hsmId, bsdmMediaState, hsm.topStateId));
          break;
        case ContentItemType.Video:
          debugger;
          dispatch(bspCreateImageState(hsmId, bsdmMediaState, hsm.topStateId));
          break;
        default:
          break;
      }
    }
  });
};

export const videoOrImagesZoneConstructor = (hsmId: string): BsBspVoidThunkAction => {
  return (dispatch: any, getState: any) => {

    // get the initial media state for the zone
    const bsdm: DmState = dmFilterDmState(getState());
    const hsm: BspHsm = getHsmById(getState(), hsmId);
    let activeState: BspHState | null = null;
    const initialMediaStateId: BsDmId | null =
      dmGetInitialMediaStateIdForZone(bsdm, { id: hsm.hsmData!.zoneId });
    if (!isNil(initialMediaStateId)) {
      const initialMediaState: DmMediaState = dmGetMediaStateById(bsdm, { id: initialMediaStateId }) as DmMediaState;
      activeState = getHStateById(getState(), initialMediaState.id);
    }

    dispatch(setActiveHState(hsmId, activeState));
  };
};

export const videoOrImagesZoneGetInitialState = (hsmId: string): any => {
  return (dispatch: any, getState: any) => {
    console.log('videoOrImagesZoneGetInitialState');
    console.log(getState());
    const hsm: BspHsm = getHsmById(getState(), hsmId);
    console.log(getState());
    const initialState = getHStateById(getState(), hsm.activeStateId);
    return Promise.resolve(initialState);
  };
};
