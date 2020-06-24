import {
  BsBspModelAction,
} from './baseAction';
import { PresentationDataState } from '../type';
import { isObject } from 'lodash';

export const UPDATE_PRESENTATION_DATA: string = 'UPDATE_PRESENTATION_DATA';
export const UPDATE_PRESENTATION_PLATFORM: string = 'UPDATE_PRESENTATION_PLATFORM';

export type UpdatePresentationDataAction = BsBspModelAction<Partial<PresentationDataState>>;

export type UpdatePresentationStringAction = BsBspModelAction<Partial<PresentationDataState>>;

export function updatePresentationData(
  presentationDataState: PresentationDataState,
): UpdatePresentationDataAction {
  if (!isObject(presentationDataState) || !isValidPresentationDataState(presentationDataState)) {
    debugger;
  }
  return {
    type: UPDATE_PRESENTATION_DATA,
    payload: presentationDataState
  };
}

export const updatePresentationPlatform = (
  platform: string,
): UpdatePresentationDataAction => {
  return {
    type: UPDATE_PRESENTATION_PLATFORM,
    payload: {
      platform,
    }
  };
};

export const presentationDataDefaults: PresentationDataState = {
  platform: '',
  srcDirectory: '',
  syncSpec: null,
};
Object.freeze(presentationDataDefaults);

export const presentationDataReducer = (
  state: PresentationDataState = presentationDataDefaults,
  { type, payload }: (
    UpdatePresentationDataAction
  ),
): PresentationDataState => {
  switch (type) {
    case UPDATE_PRESENTATION_DATA:
      return Object.assign({}, state, payload);
    case UPDATE_PRESENTATION_PLATFORM:
      return {
        ...state,
        platform: payload.platform as string,
      };
    default:
      return state;
  }
};

const isValidPresentationDataState = (state: any): boolean => {
  return true;
};
