import { bspCreateHsm } from './hsm';
import { bspCreateHState } from './hState';
import { BspHState, BspStateType, HsmData, BsBspStringThunkAction } from '../../type';
import { getHStateByName } from '../../selector/hsm';
import { isNil } from 'lodash';
import { setHsmTop } from '../../model';
// import { BspHsmType } from "../../type/hsmTypes";

export const bspCreateZoneHsm = (
  hsmName: string,
  hsmType: string,
  hsmData: HsmData
): BsBspStringThunkAction => {
  return ((dispatch: any, getState: any) => {
    console.log('invoke bspCreateZoneHsm');
    const hsmId: string = dispatch(bspCreateHsm(hsmName, hsmType, hsmData));

    dispatch(bspCreateHState(BspStateType.Top, hsmId, '', {
      name: 'top',
    }));
    const stTop: BspHState | null = getHStateByName(getState(), 'top');
    const stTopId: string = isNil(stTop) ? '' : stTop.id;

    dispatch(setHsmTop(hsmId, stTopId));

    return hsmId;
  });
};
