import { BspHState } from './hsm';
import { DmState } from '@brightsign/bsdatamodel';

export interface ArEventType {
  EventType: string;
  data?: any;
  EventData?: any;
}

export interface ArSyncSpecHash {
  method: string;
  hex: string;
}

export interface ArSyncSpecDownload {
  name: string;
  hash: ArSyncSpecHash;
  size: number;
  link: string;
}

export interface ArSyncSpecFiles {
  download: ArSyncSpecDownload[];
  ignore: any;
  delete: any;
}

export interface ArSyncSpec {
  meta: any;
  files: any;
}

export interface ArFileLUT { [fileName: string]: string; }

export interface LUT { [key: string]: any; }

export interface SubscribedEvents { [ eventKey: string]: BspHState; }

export interface ArState {
  bsdm?: DmState;
  stateMachine?: any;
  stateName?: string;
}