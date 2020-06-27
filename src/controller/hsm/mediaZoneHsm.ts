import { bspCreateZoneHsm } from './zoneHsm';

export const bspCreateMediaZoneHsm = (hsmId: string, hsmType: string): any => {
  return ((dispatch: any, getState: any) => {
    console.log('invoke bspCreateZoneHsm');
    dispatch(bspCreateZoneHsm(hsmId, hsmType));
  });
};
