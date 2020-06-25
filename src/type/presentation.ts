import { ArSyncSpec } from './playbackEngine';

export interface PresentationDataState {
  platform: string;
  srcDirectory: string;
  syncSpec: ArSyncSpec | null;
  autoSchedule: any | null;
}
