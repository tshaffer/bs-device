import { BspHState, HStateData } from '../../type/hsm';
import { addHState } from '../../model';
import { BsBspDispatch, BsBspStringThunkAction } from '../../type';
import { newBsBspId } from '../../utility';

export const bspCreateHState = (
  type: string,
  hsmId: string,
  superStateId: string,
  hStateData?: HStateData,
): BsBspStringThunkAction => {
  return ((dispatch: BsBspDispatch) => {
    const id: string = newBsBspId();
    const hState: BspHState = {
      id,
      type,
      hsmId,
      superStateId,
      hStateData,
    };
    dispatch(addHState(hState));
    return id;
  });
};
