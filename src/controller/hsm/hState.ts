import { BspHState } from '../../type/hsm';
import { addHState } from '../../model';
import { BsBspDispatch, BsBspStringThunkAction } from '../../type';
import { newBsBspId } from '../../utility';

export const bspCreateHState = (
  id: string,
  type: string,
  hsmId: string,
  superStateId: string,
): BsBspStringThunkAction => {
  return ((dispatch: BsBspDispatch) => {
    const generatedId: string = newBsBspId();
    console.log('hStateId = ', generatedId);
    const hState: BspHState = {
      id,
      type,
      hsmId,
      superStateId,
    };
    dispatch(addHState(hState));
    return generatedId;
  });
};
