import { isNil } from 'lodash';
import isomorphicPath from 'isomorphic-path';
import * as fs from 'fs-extra';

import {
  BsBspState,
  ArSyncSpec,
  // ArSyncSpecDownload
} from '../type';

import { updatePresentationPlatform, updatePresentationSrcDirectory } from '../model/presentation';
import { getPresentationPlatform, getSrcDirectory } from '../selector';

export const loadPresentationData = (): any => {
  return ((dispatch: any, getState: () => BsBspState) => {
    dispatch(setPlatform());
    const platform = getPresentationPlatform(getState());
    if (!isNil(platform)) {
      dispatch(setSrcDirectory(platform));
      const srcDirectory = getSrcDirectory(getState());
      getSyncSpec(srcDirectory)
        .then((syncSpec: ArSyncSpec) => {
          console.log(syncSpec);
          //   // TEDTODO - write to redux
          //   _poolAssetFiles = getPoolAssetFiles(syncSpec, getRootDirectory());
          //   return getAutoschedule(syncSpec, getRootDirectory());
          // }).then((autoSchedule: any) => {
          //   // TEDTODO - write to redux
          //   _autoSchedule = autoSchedule;
          //   // _hsmList = [];
          return Promise.resolve();
        });
    } else {
      debugger;
    }
  });
};

const setPlatform = () => {
  return ((dispatch: any, getState: () => BsBspState) => {
    let platform = '';
    try {
      const gpio = new BSControlPort('BrightSign') as any;
      console.log('create controlPort: ');
      console.log(gpio);
      platform = 'BrightSign';
    } catch (e) {
      platform = 'Desktop';
      console.log('failed to create controlPort: ');
    }
    dispatch(updatePresentationPlatform(platform));
  });
};

export const setSrcDirectory = (platform: string) => {
  return ((dispatch: any, getState: () => BsBspState) => {
    let srcDirectory = '';
    if (platform === 'Desktop') {
      srcDirectory = '/Users/tedshaffer/Desktop/autotron';
    } else {
      const process = require('process');
      process.chdir('/storage/sd');
    }
    platform = dispatch(updatePresentationSrcDirectory(srcDirectory));
  });
};

// export function getAppArtifacts(): Promise<void> {
//   return getSyncSpec()
//     .then((syncSpec: ArSyncSpec) => {
//       // TEDTODO - write to redux
//       _poolAssetFiles = getPoolAssetFiles(syncSpec, getRootDirectory());
//       return getAutoschedule(syncSpec, getRootDirectory());
//     }).then((autoSchedule: any) => {
//       // TEDTODO - write to redux
//       _autoSchedule = autoSchedule;
//       // _hsmList = [];
//       return Promise.resolve();
//     });
// }

// function getAutoschedule(syncSpec: ArSyncSpec, rootPath: string) {
//   return getSyncSpecReferencedFile('autoschedule.json', syncSpec, rootPath);
// }

// function getSyncSpecReferencedFile(fileName: string, syncSpec: ArSyncSpec, rootPath: string): Promise<object> {

//   const syncSpecFile: ArSyncSpecDownload | null = getFile(syncSpec, fileName);
//   if (syncSpecFile == null) {
//     return Promise.reject('file not found');
//   }

//   // const fileSize = syncSpecFile.size;
//   const filePath: string = isomorphicPath.join(rootPath, syncSpecFile.link);

//   return fs.readFile(filePath, 'utf8')
//     .then((fileStr: string) => {

//       const file: object = JSON.parse(fileStr);

//       // I have commented out the following code to allow hacking of files -
//       // that is, overwriting files in the pool without updating the sync spec with updated sha1
//       // if (fileSize !== fileStr.length) {
//       //   debugger;
//       // }
//       return Promise.resolve(file);
//     });
// }

// function getFile(syncSpec: ArSyncSpec, fileName: string): ArSyncSpecDownload | null {

//   let file: ArSyncSpecDownload | null = null;

//   syncSpec.files.download.forEach((syncSpecFile: ArSyncSpecDownload) => {
//     if (syncSpecFile.name === fileName) {
//       file = syncSpecFile;
//       return;
//     }
//   });

//   return file;
// }

function getSyncSpec(rootDirectory: string): Promise<any> {
  return getSyncSpecFilePath(rootDirectory)
    .then((syncSpecFilePath: string | null) => {
      if (!syncSpecFilePath) {
        // TEDTODO - error object
        return Promise.reject('no sync spec found');
      } else {
        return Promise.resolve(readSyncSpec(syncSpecFilePath));
      }
    });
}

function getSyncSpecFilePath(rootDirectory: string): Promise<string | null> {
  return getLocalSyncSpec(rootDirectory)
    .then((localSyncSpecFilePath) => {
      if (isNil(localSyncSpecFilePath)) {
        return getNetworkedSyncSpec(rootDirectory);
      } else {
        return Promise.resolve(localSyncSpecFilePath);
      }
    });
}

function getNetworkedSyncSpec(rootDirectory: string): Promise<string | null> {
  const filePath: string = getNetworkedSyncSpecFilePath(rootDirectory);
  return fs.pathExists(filePath)
    .then((exists: boolean) => {
      if (exists) {
        return Promise.resolve(filePath);
      } else {
        return Promise.resolve(null);
      }
    });
}

function getLocalSyncSpec(rootDirectory: string): Promise<string | null> {
  const filePath: string = getLocalSyncSpecFilePath(rootDirectory);
  return fs.pathExists(filePath)
    .then((exists: boolean) => {
      if (exists) {
        return Promise.resolve(filePath);
      } else {
        return Promise.resolve(null);
      }
    });
}

function getLocalSyncSpecFilePath(rootDirectory: string): string {
  const syncSpecFilePath = isomorphicPath.join(rootDirectory, 'local-sync.json');
  return syncSpecFilePath;
}

function getNetworkedSyncSpecFilePath(rootDirectory: string): string {
  // return isomorphicPath.join(PlatformService.default.getRootDirectory(), 'current-sync.json');
  return isomorphicPath.join(rootDirectory, 'current-sync.json');
}

// export function getPoolFilePath(fileName: string): string {
//   // TEDTODO - put this function in selector
//   const filePath: string = _poolAssetFiles[fileName];
//   return filePath;
// }

// export function getPoolDirectory(): string {
//   return isomorphicPath.join(getRootDirectory(), 'pool');
// }

function readSyncSpec(syncSpecFilePath: string): Promise<ArSyncSpec> {

  return fs.readFile(syncSpecFilePath, 'utf8')
    .then((syncSpecStr: string) => {
      const syncSpec: ArSyncSpec = JSON.parse(syncSpecStr);
      return Promise.resolve(syncSpec);
    });
}

// function getPoolAssetFiles(syncSpec: ArSyncSpec, pathToRoot: string): ArFileLUT {

//   const poolAssetFiles: ArFileLUT = {};

//   syncSpec.files.download.forEach((syncSpecFile: ArSyncSpecDownload) => {
//     poolAssetFiles[syncSpecFile.name] = isomorphicPath.join(pathToRoot, syncSpecFile.link);
//   });

//   return poolAssetFiles;
// }
