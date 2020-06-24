import {
  BsBspState,
} from '../type';
import { isNil } from 'lodash';

// ------------------------------------
// Selectors
// ------------------------------------
export function getPresentationPlatform(state: BsBspState): string {
  if (
    !isNil(state.bsPlayer)
    && !isNil(state.bsPlayer.presentationData)
    && !isNil(state.bsPlayer.presentationData.platform)) {
    return state.bsPlayer.presentationData.platform;
  }
  return '';
}
