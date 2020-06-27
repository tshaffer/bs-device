import { DmMediaState } from '@brightsign/bsdatamodel';
import {
  BspHState,
  BspStateType,
} from '../../type';
import { addHState } from '../../model/hsm';

export const bspCreateImageState = (
  hsmId: string,
  mediaState: DmMediaState,
  superStateId: string,
): any => {
  return ((dispatch: any) => {
    const hState: BspHState = {
      id: mediaState.id,
      type: BspStateType.Image,
      hsmId,
      superStateId,
    };
    dispatch(addHState(hState));
  });
};
