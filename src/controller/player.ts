import { Store } from 'redux';
import { BsBrightSignPlayerState } from '../type/base';

export function initPlayer(store: Store<BsBrightSignPlayerState>) {
  return ((dispatch: any, getState: () => BsBrightSignPlayerState) => {
    return null;
  });
}
