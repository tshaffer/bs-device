import { BspHState } from '../../type/hsm';
import { addHState } from '../../model';

export const bspCreateHState = (
  id: string,
  type: string,
  hsmId: string,
) => {
  return ((dispatch: any) => {
    const hState: BspHState = {
      id,
      type,
      hsmId,
      superStateId: '',
    };
    dispatch(addHState(hState));
  });
};
