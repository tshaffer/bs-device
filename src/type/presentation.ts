import { ArSyncSpec } from './playbackEngine';
import { ScheduledPresentation } from './schedule';

export interface PresentationDataState {
  platform: string;
  srcDirectory: string;
  syncSpec: ArSyncSpec | null;
  autoSchedule: ScheduledPresentation[] | null;
}
