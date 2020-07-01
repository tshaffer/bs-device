import { bspCreateHsm } from './hsm';
import { bspCreateHState } from './hState';
import { BspHState, BspStateType, HsmData } from '../../type';
import { getHStateById } from '../../selector/hsm';
import { isNil } from 'lodash';
import { setHsmTop } from '../../model';
// import { BspHsmType } from "../../type/hsmTypes";

export const bspCreateZoneHsm = (
  hsmName: string,
  hsmType: string,
  hsmData: HsmData
): any => {
  return ((dispatch: any, getState: any) => {
    console.log('invoke bspCreateZoneHsm');
    const hsmId: string = dispatch(bspCreateHsm(hsmName, hsmType, hsmData));

    dispatch(bspCreateHState('top', BspStateType.Top, hsmId, ''));
    const stTop: BspHState | null = getHStateById(getState(), 'top');
    const stTopId: string = isNil(stTop) ? '' : stTop.id;

    dispatch(setHsmTop(hsmId, stTopId));
  });
};
