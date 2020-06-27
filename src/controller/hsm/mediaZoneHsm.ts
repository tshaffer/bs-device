import { bspCreateZoneHsm } from './zoneHsm';
import { DmZone } from '@brightsign/bsdatamodel';
import { HsmData } from '../../type';

export const bspCreateMediaZoneHsm = (hsmId: string, hsmType: string, bsdmZone: DmZone): any => {
  return ((dispatch: any, getState: any) => {
    console.log('invoke bspCreateZoneHsm');

    const hsmData: HsmData = {
      x: bsdmZone.position.x,
      y: bsdmZone.position.y,
      height: bsdmZone.position.height,
      width: bsdmZone.position.width,
      initialMediaStateId: bsdmZone.initialMediaStateId
    };

    // this.x = this.bsdmZone.position.x;
    // this.y = this.bsdmZone.position.y;
    // this.width = this.bsdmZone.position.width;
    // this.height = this.bsdmZone.position.height;

    // this.initialMediaStateId = this.bsdmZone.initialMediaStateId;

    dispatch(bspCreateZoneHsm(hsmId, hsmType, hsmData));
  });
};
