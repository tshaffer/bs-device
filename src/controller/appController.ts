import { isNil } from 'lodash';
import isomorphicPath from 'isomorphic-path';
import * as fs from 'fs-extra';

import {
  BsBspState,
  ArSyncSpec,
  // ScheduledPresentation,
  BsBspDispatch,
  BsBspVoidPromiseThunkAction,
  BsBspNonThunkAction,
  BspSchedule,
} from '../type';

import {
  updatePresentationPlatform,
  updatePresentationSrcDirectory,
  updatePresentationSyncSpec,
  updatePresentationAutoschedule
} from '../model/presentation';
import {
  getPresentationPlatform,
  getSrcDirectory,
  getSyncSpecFile
} from '../selector';
import { launchHSM } from './playbackEngine';

export const initPresentation = (): any => {
  return ((dispatch: BsBspDispatch) => {
    dispatch(loadPresentationData()).then(() => {
      dispatch(launchPlayback());
    });
  });
};

const launchPlayback = (): BsBspNonThunkAction => {
    return ((dispatch: BsBspDispatch, getState: () => BsBspState) => {
      dispatch(launchHSM());
    });
  };

const loadPresentationData = (): BsBspVoidPromiseThunkAction => {
    return ((dispatch: BsBspDispatch, getState: () => BsBspState) => {
      dispatch(setPlatform());
      dispatch(setSrcDirectory());
      return dispatch(setSyncSpec())
        .then(() => {
          return dispatch(setAutoschedule());
        });
    });
  };

const setPlatform = (): BsBspNonThunkAction => {
    return ((dispatch: BsBspDispatch) => {
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

const setSrcDirectory = (): BsBspNonThunkAction => {
    return ((dispatch: BsBspDispatch, getState: () => BsBspState) => {
      const platform = getPresentationPlatform(getState());
      let srcDirectory = '';
      if (platform === 'Desktop') {
        srcDirectory = '/Users/tedshaffer/Desktop/autotron-2020';
      } else {
        const process = require('process');
        process.chdir('/storage/sd');
      }
      dispatch(updatePresentationSrcDirectory(srcDirectory));
    });
  };

const setSyncSpec = (): BsBspVoidPromiseThunkAction => {
    return ((dispatch: BsBspDispatch, getState: () => BsBspState) => {
      const srcDirectory = getSrcDirectory(getState());
      return getSyncSpec(srcDirectory)
        .then((syncSpec) => {
          dispatch(updatePresentationSyncSpec(syncSpec));
          return Promise.resolve();
        });
    });
  };

const setAutoschedule = (): BsBspVoidPromiseThunkAction => {
    return ((dispatch: BsBspDispatch, getState: () => BsBspState) => {
      return new Promise((resolve, reject) => {
        getSyncSpecFile(getState(), 'autoschedule.json')
          .then((autoSchedule: BspSchedule) => {
            dispatch(updatePresentationAutoschedule(autoSchedule));
            return resolve();
          });
      });
    });
  };

function getSyncSpec(rootDirectory: string): Promise<ArSyncSpec> {
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
    return isomorphicPath.join(rootDirectory, 'local-sync.json');
  }

function getNetworkedSyncSpecFilePath(rootDirectory: string): string {
    return isomorphicPath.join(rootDirectory, 'current-sync.json');
  }

function readSyncSpec(syncSpecFilePath: string): Promise<ArSyncSpec> {
    return fs.readFile(syncSpecFilePath, 'utf8')
      .then((syncSpecStr: string) => {
        const syncSpec: ArSyncSpec = JSON.parse(syncSpecStr);
        return Promise.resolve(syncSpec);
      });
  }
