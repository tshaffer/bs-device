import { isNil } from 'lodash';
import { Store } from 'redux';
import isomorphicPath from 'isomorphic-path';
import * as fs from 'fs-extra';

// import {
//   DmSignState,
//   dmOpenSign,
// } from '@brightsign/bsdatamodel';

import { BsBspState } from '../type';
import { bspCreatePlayerHsm, bspInitializePlayerHsm } from './hsm';
import { ArSyncSpec, ArFileLUT, ArSyncSpecDownload, ArEventType } from '../type';

let srcDirectory: string = '';
let platform: string = '';

let _autotronStore: Store<BsBspState>;
let _syncSpec: ArSyncSpec;
let _poolAssetFiles: ArFileLUT;
let _autoSchedule: any;

try {
  const gpio = new BSControlPort('BrightSign') as any;
  console.log('create controlPort: ');
  console.log(gpio);
  platform = 'BrightSign';
} catch (e) {
  platform = 'Desktop';
  console.log('failed to create controlPort: ');
}

// TEDTODO
if (platform === 'Desktop') {
  srcDirectory = '/Users/tedshaffer/Desktop/autotron';
} else {
  const process = require('process');
  process.chdir('/storage/sd');
  srcDirectory = '';
}

export function initPlayer(store: Store<BsBspState>) {
  return ((dispatch: any, getState: () => BsBspState) => {
    _autotronStore = store;
    console.log(_autotronStore);
    dispatch(launchHSM());
  });
}

export function getRuntimeArtifacts(): Promise<void> {
  return getSyncSpec()
    .then((syncSpec: ArSyncSpec) => {
      _syncSpec = syncSpec;
      console.log(_syncSpec);
      _poolAssetFiles = getPoolAssetFiles(syncSpec, getRootDirectory());
      return getAutoschedule(syncSpec, getRootDirectory());
    }).then((autoSchedule: any) => {
      _autoSchedule = autoSchedule;
      console.log(_autoSchedule);
      // _hsmList = [];
      return Promise.resolve();
    });
}

function launchHSM() {
  return ((dispatch: any) => {
    dispatch(bspCreatePlayerHsm());
    dispatch(bspInitializePlayerHsm());
  });
}

function getAutoschedule(syncSpec: ArSyncSpec, rootPath: string) {
  return getSyncSpecReferencedFile('autoschedule.json', syncSpec, rootPath);
}

function getSyncSpecReferencedFile(fileName: string, syncSpec: ArSyncSpec, rootPath: string): Promise<object> {

  const syncSpecFile: ArSyncSpecDownload | null = getFile(syncSpec, fileName);
  if (syncSpecFile == null) {
    return Promise.reject('file not found');
  }

  // const fileSize = syncSpecFile.size;
  const filePath: string = isomorphicPath.join(rootPath, syncSpecFile.link);

  return fs.readFile(filePath, 'utf8')
    .then((fileStr: string) => {

      const file: object = JSON.parse(fileStr);

      // I have commented out the following code to allow hacking of files -
      // that is, overwriting files in the pool without updating the sync spec with updated sha1
      // if (fileSize !== fileStr.length) {
      //   debugger;
      // }
      return Promise.resolve(file);
    });
}

function getFile(syncSpec: ArSyncSpec, fileName: string): ArSyncSpecDownload | null {

  let file: ArSyncSpecDownload | null = null;

  syncSpec.files.download.forEach((syncSpecFile: ArSyncSpecDownload) => {
    if (syncSpecFile.name === fileName) {
      file = syncSpecFile;
      return;
    }
  });

  return file;
}

function getSyncSpec(): Promise<any> {
  return getSyncSpecFilePath()
    .then((syncSpecFilePath: string | null) => {
      if (!syncSpecFilePath) {
        // TEDTODO - error object
        return Promise.reject('no sync spec found');
      } else {
        return Promise.resolve(readSyncSpec(syncSpecFilePath));
      }
    });
}

function readSyncSpec(syncSpecFilePath: string): Promise<ArSyncSpec> {

  return fs.readFile(syncSpecFilePath, 'utf8')
    .then((syncSpecStr: string) => {
      const syncSpec: ArSyncSpec = JSON.parse(syncSpecStr);
      return Promise.resolve(syncSpec);
    });
}

function getPoolAssetFiles(syncSpec: ArSyncSpec, pathToRoot: string): ArFileLUT {

  const poolAssetFiles: ArFileLUT = {};

  syncSpec.files.download.forEach((syncSpecFile: ArSyncSpecDownload) => {
    poolAssetFiles[syncSpecFile.name] = isomorphicPath.join(pathToRoot, syncSpecFile.link);
  });

  return poolAssetFiles;
}

function getSyncSpecFilePath(): Promise<string | null> {
  return getLocalSyncSpec()
    .then((localSyncSpecFilePath) => {
      if (isNil(localSyncSpecFilePath)) {
        return getNetworkedSyncSpec();
      } else {
        return Promise.resolve(localSyncSpecFilePath);
      }
    });
}

function getNetworkedSyncSpec(): Promise<string | null> {
  const filePath: string = getNetworkedSyncSpecFilePath();
  return fs.pathExists(filePath)
    .then((exists: boolean) => {
      if (exists) {
        return Promise.resolve(filePath);
      } else {
        return Promise.resolve(null);
      }
    });
}

function getLocalSyncSpec(): Promise<string | null> {
  const filePath: string = getLocalSyncSpecFilePath();
  return fs.pathExists(filePath)
    .then((exists: boolean) => {
      if (exists) {
        return Promise.resolve(filePath);
      } else {
        return Promise.resolve(null);
      }
    });
}

function getLocalSyncSpecFilePath(): string {
  const rootDirectory: string = getRootDirectory();
  const syncSpecFilePath = isomorphicPath.join(rootDirectory, 'local-sync.json');
  return syncSpecFilePath;
}

function getNetworkedSyncSpecFilePath(): string {
  // return isomorphicPath.join(PlatformService.default.getRootDirectory(), 'current-sync.json');
  return isomorphicPath.join(getRootDirectory(), 'current-sync.json');
}

export function getPoolFilePath(fileName: string): string {
  const filePath: string = _poolAssetFiles[fileName];
  return filePath;
}

export function getPoolDirectory(): string {
  return isomorphicPath.join(getRootDirectory(), 'pool');
}

export function getFeedDirectory(): string {
  return isomorphicPath.join(getRootDirectory(), 'feedPool');
}

export function getRootDirectory(): string {
  return srcDirectory;
}

export const restartPlayback = (presentationName: string): Promise<void> => {
  console.log('invoke restartPlayback');

  // const rootPath = getRootDirectory();

  // // TEDTODO - only a single scheduled item is currently supported
  // const scheduledPresentation = _autoSchedule.scheduledPresentations[0];
  // const presentationToSchedule = scheduledPresentation.presentationToSchedule;

  // presentationName = presentationToSchedule.name;

  // const autoplayFileName = presentationName + '.bml';

  // return getSyncSpecReferencedFile(autoplayFileName, _syncSpec, rootPath)
  //   .then((bpfxState: any) => {
  //     const autoPlay: any = bpfxState.bsdm;
  //     const signState = autoPlay as DmSignState;
  //     _autotronStore.dispatch(dmOpenSign(signState));
  //     return Promise.resolve();
  //   });
  return Promise.resolve();
};

// function startPlayback() {

//   return (dispatch: any, getState: any) => {
//     console.log('startPlayback');
//   };
// }

export function postMessage(event: ArEventType) {
  return ((dispatch: any) => {
    console.log('postMessage');
  });
}

export function queueHsmEvent(event: ArEventType) {
  return (dispatch: any) => {
    console.log('restartPlayback');
  };
}
