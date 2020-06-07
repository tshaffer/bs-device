import { BsBrightSignPlayerState } from '../type';
import { MediaListItem } from '../type';

// ------------------------------------
// Selectors
// ------------------------------------
// TEDTODO - create selector?
export function getActiveMediaListDisplayItem(state: BsBrightSignPlayerState, zoneId: string): MediaListItem | null {
  const activeMediaListDisplayItemIdByZone = state.bsPlayer.activeMediaListDisplayItems;
  const activeMediaListDisplayItem: MediaListItem | null = activeMediaListDisplayItemIdByZone[zoneId];
  return activeMediaListDisplayItem;
}
