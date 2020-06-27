import { ArSyncSpec } from './playbackEngine';
import { BspSchedule } from './schedule';

export interface PresentationDataState {
  platform: string;
  srcDirectory: string;
  syncSpec: ArSyncSpec | null;
  autoSchedule: BspSchedule | null;
}
