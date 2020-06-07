import { BsBrightSignPlayerState } from '../type';
import { ArMrssItem } from '../type';

// ------------------------------------
// Selectors
// ------------------------------------
// TEDTODO - create selector?
export function getActiveMrssDisplayItem(state: BsBrightSignPlayerState, zoneId: string): ArMrssItem | null {
  const activeMrssDisplayItemIdByZone = state.bsPlayer.activeMrssDisplayItems;
  const activeMrssDisplayItem: ArMrssItem | null = activeMrssDisplayItemIdByZone[zoneId];
  return activeMrssDisplayItem;
}
