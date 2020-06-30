import { BspHState } from '../../type/hsm';
import { addHState } from '../../model';
import { BsBspDispatch } from '../../type';

export const bspCreateHState = (
  id: string,
  type: string,
  hsmId: string,
  superStateId: string,
) => {
  return ((dispatch: BsBspDispatch) => {
    const hState: BspHState = {
      id,
      type,
      hsmId,
      superStateId,
    };
    dispatch(addHState(hState));
  });
};
