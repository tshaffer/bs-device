// Generated by dts-bundle v0.7.3
// Dependencies for this module:
//   ../../react
//   ../../@brightsign/bsdatamodel
//   ../../redux
//   ../../@brightsign/assetpool
//   ../../@brightsign/bscore

import * as React from 'react';
import { DmMediaState } from '@brightsign/bsdatamodel';
import { DmState } from '@brightsign/bsdatamodel';
import { DmZone } from '@brightsign/bsdatamodel';
import { DmEvent } from '@brightsign/bsdatamodel';
import { DmDerivedContentItem } from '@brightsign/bsdatamodel';
import { DmcDataFeed } from '@brightsign/bsdatamodel';
import { Store } from 'redux';
import { Action } from 'redux';
import { ActionCreator } from 'redux';
import { Dispatch } from 'redux';
import { Reducer } from 'redux';
import { DmParameterizedString } from '@brightsign/bsdatamodel';
import { Asset } from '@brightsign/assetpool';
import { BsDmId } from '@brightsign/bsdatamodel';
import { DataFeedUsageType } from '@brightsign/bscore';
import { ContentItemType } from '@brightsign/bscore';
import { DmBpOutputCommandData } from '@brightsign/bsdatamodel';

/** @module Controller:index */

/** @module Model:index */

/** @module Selector:index */

/** @module Types:index */

/** @internal */
export interface ImageProps {
    src: string;
    width: number;
    height: number;
}
export class ImageComponent extends React.Component<ImageProps> {
    render(): JSX.Element;
}
export const Image: import("react-redux").ComponentClass<any> & {
    WrappedComponent: React.ComponentType<ImageProps>;
};

export interface VideoProps {
    width: number;
    height: number;
    onVideoEnd: () => void;
    onVideoRefRetrieved: (videoElementRef: any) => void;
    src: string;
}
export class VideoComponent extends React.Component<VideoProps> {
    videoElementRef: any;
    onVideoRefRetrieved(videoElementRef: any): void;
    render(): JSX.Element;
}
export const Video: import("react-redux").ComponentClass<any> & {
    WrappedComponent: React.ComponentType<VideoProps>;
};

/** @internal */
export interface MediaZoneProps {
    key: string;
    bsdm: DmState;
    zone: DmZone;
    width: number;
    height: number;
    activeMediaStateId: string;
    activeMrssDisplayItem: ArMediaFeedItem;
    activeMediaListDisplayItem: MediaListItem;
    postBSPMessage: any;
}
export default class MediaZoneComponent extends React.Component<MediaZoneProps> {
    constructor(props: MediaZoneProps);
    videoRefRetrieved(videoElementRef: any): void;
    renderMediaItem(mediaState: DmMediaState, contentItem: DmDerivedContentItem): JSX.Element | null;
    renderMediaListDisplayItem(): JSX.Element | null;
    renderMrssDisplayItem(): JSX.Element | null;
    getEvents(bsdm: DmState, mediaStateId: string): DmEvent[];
    render(): JSX.Element | null;
}
export const MediaZone: import("react-redux").ComponentClass<any> & {
    WrappedComponent: React.ComponentType<MediaZoneProps>;
};

export interface SignProps {
    bsdm: DmState;
}
export const Sign: import("react-redux").ComponentClass<Pick<SignProps, "bsdm">> & {
    WrappedComponent: React.ComponentType<SignProps>;
};

export interface AppProps {
    bsdm: DmState;
    activeHStates: any;
    onKeyPress: (key: any) => void;
}
export let myApp: {};
export const App: import("react-redux").ComponentClass<Pick<AppProps, never>> & {
    WrappedComponent: React.ComponentType<AppProps>;
};

export const initModel: () => BsBrightSignPlayerModelThunkAction<Promise<any>>;
export const resetModel: () => BsBrightSignPlayerModelThunkAction<BsBrightSignPlayerModelAction<null>>;

export function retrieveDataFeed(bsdm: DmState, dataFeed: DmcDataFeed): Promise<ArFeed>;
export function readCachedFeed(bsdmDataFeed: DmcDataFeed): Promise<ArFeed | null>;
export function processFeed(bsdmDataFeed: DmcDataFeed, feed: ArFeed): BsBspVoidPromiseThunkAction;
export function downloadMRSSFeedContent(arDataFeed: ArMrssFeed): (dispatch: any, getState: any) => void;
export function downloadContentFeedContent(arDataFeed: ArContentFeed): (dispatch: any, getState: any) => void;
export function processTextDataFeed(bsdmDataFeed: DmcDataFeed, textFeed: ArFeed): BsBspVoidPromiseThunkAction;
export function parseSimpleRSSFeed(bsdmDataFeed: DmcDataFeed, textFeed: ArFeed): BsBspVoidThunkAction;
export function getFeedCacheRoot(): string;
export function feedIsMrss(feed: any): boolean;

export function getPlatform(): string;
export function initRuntime(store: Store<BsBrightSignPlayerState>): (dispatch: any, getState: () => BsBrightSignPlayerState) => Promise<void>;
export function getReduxStore(): Store<BsBrightSignPlayerState>;
export function tmpSetVideoElementRef(videoElementRef: any): void;
export function tmpGetVideoElementRef(): any;
export function getRuntimeFiles(): Promise<void>;
export function getPoolFilePath(fileName: string): string;
export function getPoolDirectory(): string;
export function getFeedDirectory(): string;
export function getRootDirectory(): string;
export function postMessage(event: ArEventType): (dispatch: any) => void;
export function hsmInitialized(): boolean;
export function queueHsmEvent(event: ArEventType): (dispatch: any) => void;

export const ADD_HSM = "ADD_HSM";
export function addHSM(hsm: HSM): {
    type: string;
    payload: HSM;
};
export const hsmReducer: (state: HSMList | undefined, action: ActionWithPayload) => HSMList;
/** @private */
export const isValidHSMs: (state: any) => boolean;

export const SET_ACTIVE_HSTATE = "SET_ACTIVE_HSTATE";
export function setActiveHState(hsmId: string, activeState: any): ActionWithPayload;
export const activeHStateReducer: (state: HStateMap | undefined, action: ActionWithPayload) => HStateMap;
/** @private */
export const isValidActiveHStates: (state: any) => boolean;

export const SET_ACTIVE_MEDIALIST_DISPLAY_ITEM = "SET_ACTIVE_MEDIALIST_DISPLAY_ITEM";
export function setActiveMediaListDisplayItem(zoneId: string, activeMediaListDisplayItem: MediaListItem): ActionWithPayload;
export const activeMediaListDisplayItemReducer: (state: MediaListDisplayItemMap | undefined, action: ActionWithPayload) => MediaListDisplayItemMap;
/** @private */
export const isValidActiveMediaListDisplayItems: (state: any) => boolean;

export const SET_ACTIVE_MRSS_DISPLAY_ITEM = "SET_ACTIVE_MRSS_DISPLAY_ITEM";
export function setActiveMrssDisplayItem(zoneId: string, activeMrssDisplayItem: ArMrssItem): ActionWithPayload;
export const activeMrssDisplayItemReducer: (state: MrssDisplayItemMap | undefined, action: ActionWithPayload) => MrssDisplayItemMap;
/** @private */
export const isValidActiveMrssDisplayItems: (state: any) => boolean;

/** @module Model:base */
/** @private */
export interface ActionWithPayload extends Action {
    payload: any;
}
/** @private */
export const BSBSBRIGHTSIGNPLAYERMODEL_BATCH = "BSBSBRIGHTSIGNPLAYERMODEL_BATCH";
/** @private */
export const BSBSBRIGHTSIGNPLAYERMODEL_REHYDRATE = "BSBSBRIGHTSIGNPLAYERMODEL_REHYDRATE";
/** @private */
export const BSBSBRIGHTSIGNPLAYERMODEL_RESET = "BSBSBRIGHTSIGNPLAYERMODEL_RESET";
/** @private */
export type BsBrightSignPlayerModelDispatch = Dispatch<BsBrightSignPlayerModelState>;
/** @private */
export interface BsBrightSignPlayerModelBaseAction extends Action {
    type: string;
    payload: {};
    error?: boolean;
    meta?: {};
}
/** @private */
export interface BsBrightSignPlayerModelAction<T> extends BsBrightSignPlayerModelBaseAction {
    payload: T;
}
/** @private */
export type BsBrightSignPlayerModelActionCreator<T> = ActionCreator<BsBrightSignPlayerModelAction<T>>;
/** @private */
export type BsBrightSignPlayerModelThunkAction<T> = (dispatch: BsBrightSignPlayerModelDispatch, getState: () => BsBrightSignPlayerModelState, extraArgument: undefined) => T;
/** @private */
export const bsBrightSignPlayerModelBatchAction: (action: BsBrightSignPlayerModelBaseAction[]) => BsBrightSignPlayerModelBatchAction;
/** @private */
export interface BsBrightSignPlayerModelBatchAction extends Action {
    type: string;
    payload: BsBrightSignPlayerModelBaseAction[];
}
/** @private */
export interface RehydrateBsBrightSignPlayerModelParams {
    newBsBrightSignPlayerModelState: BsBrightSignPlayerModelState;
}
/** @private */
export type RehydrateBsBrightSignPlayerModelAction = BsBrightSignPlayerModelAction<RehydrateBsBrightSignPlayerModelParams>;
export const bsBrightSignPlayerModelRehydrateModel: (bsBrightSignPlayerModelState: BsBrightSignPlayerModelState) => RehydrateBsBrightSignPlayerModelAction;
/** @private */
export type ResetBsBrightSignPlayerModelAction = BsBrightSignPlayerModelAction<null>;
export const bsBrightSignPlayerModelResetModel: () => ResetBsBrightSignPlayerModelAction;

/** @module Model:base */
export type BsBrightSignPlayerReducer = Reducer<BsBrightSignPlayerModelState>;
export const bsBrightSignPlayerReducer: BsBrightSignPlayerReducer;
export const isValidBsBrightSignPlayerModelState: (state: any) => boolean;
export const isValidBsBrightSignPlayerModelStateShallow: (state: any) => boolean;

export const ADD_USER_VARIABLE = "ADD_USER_VARIABLE";
export function addUserVariable(userVariableId: string, currentValue: DmParameterizedString): {
    type: string;
    payload: {
        userVariableId: string;
        currentValue: DmParameterizedString;
    };
};
export const userVariableReducer: (state: UserVariableMap | undefined, action: ActionWithPayload) => UserVariableMap;
/** @private */
export const isValidUserVariableState: (state: any) => boolean;

/** @module Selector:base */
/** @private */
export const bsBrightSignPlayerModelFilterBaseState: (state: any) => BsBrightSignPlayerModelState;
/** @private */
export const bsBrightSignPlayerModelGetBaseState: (state: BsBrightSignPlayerModelState) => BsBrightSignPlayerModelState;

export function getActiveHStateId(state: BsBrightSignPlayerState, hsmId: string): string | null;

export function getActiveMediaListDisplayItem(state: BsBrightSignPlayerState, zoneId: string): MediaListItem | null;

export function getActiveMrssDisplayItem(state: BsBrightSignPlayerState, zoneId: string): ArMrssItem | null;

export function getDataFeedById(state: BsBrightSignPlayerState, dataFeedId: string): ArDataFeed | null;
export function getMrssFeedItems(feed: any): ArMrssItem[];
export function allDataFeedContentExists(dataFeed: ArMrssFeed | ArContentFeed): boolean;
export function dataFeedContentExists(dataFeed: ArMrssFeed): boolean;
export function getFeedPoolFilePathFromAsset(asset: Asset): string;
export function getFeedPoolFilePath(hashValue: string): string;
export function feedPoolFileExists(hashValue: string): string;

export function getActiveMediaStateId(state: BsBrightSignPlayerState, zoneId: string): BsDmId | null;

export function getUserVariableById(state: BsBrightSignPlayerState, userVariableId: string): UserVariable | null;

/** @module Types:base */
/** @private */
export type DeepPartial<T> = {
    [P in keyof T]?: DeepPartial<T[P]>;
};
export interface BsBrightSignPlayerState {
    bsdm: DmState;
    bsPlayer: BsBrightSignPlayerModelState;
}
/** @private */
export interface BsBrightSignPlayerModelState {
    hsms: HSM[];
    activeHStates: HStateMap;
    activeMrssDisplayItems: MrssDisplayItemMap;
    activeMediaListDisplayItems: MediaListDisplayItemMap;
    userVariables: UserVariableMap;
    arDataFeeds: ArDataFeedMap;
}
export type BsBspDispatch = Dispatch<BsBrightSignPlayerState>;
export interface BsBspBaseAction extends Action {
    type: string;
    payload: {} | null;
    error?: boolean;
    meta?: {};
}
export type BsBspVoidThunkAction = (dispatch: BsBspDispatch, getState: () => BsBrightSignPlayerState, extraArgument: undefined) => void;
export type BsBspStringThunkAction = (dispatch: BsBspDispatch, getState: () => BsBrightSignPlayerState, extraArgument: undefined) => string;
export type BsBspVoidPromiseThunkAction = (dispatch: BsBspDispatch, getState: () => BsBrightSignPlayerState, extraArgument: undefined) => Promise<void>;
export type BsBspThunkAction<T> = (dispatch: BsBspDispatch, getState: () => BsBrightSignPlayerState, extraArgument: undefined) => BsBspAction<T>;
export interface BsBspAction<T> extends BsBspBaseAction {
    payload: T;
}
export type ExitHandlerAction = BsBspAction<void>;
export interface FileToPublish {
    fileName: string;
    filePath: string;
    hash: string;
    poolFileName: string;
    size: number;
}
export interface FilesToPublishMap {
    [fileName: string]: FileToPublish;
}
export interface ContentFileMap {
    [fileName: string]: string;
}
export interface SyncSpec {
    files: SyncSpecFiles;
    meta: any;
}
export interface SyncSpecFiles {
    delete: any[];
    download: SyncSpecDownload[];
    ignore: any[];
}
export interface SyncSpecHash {
    hex: string;
    method: string;
}
export interface SyncSpecDownload {
    name: string;
    link: string;
    hash: SyncSpecHash;
    size: number;
    group?: string;
}

export interface HStateMap {
    [hsmId: string]: string | null;
}

export interface MediaListDisplayItemMap {
    [hsmId: string]: MediaListItem | null;
}

export interface MrssDisplayItemMap {
    [hsmId: string]: ArMrssItem | null;
}

export interface ArFeed {
    rss: any;
}
export interface ArDataFeedBase {
    type: string;
    id: BsDmId;
    sourceId: BsDmId;
    usage: DataFeedUsageType;
}
export interface ArTextItem {
    articleTitle: string;
    articleDescription: string;
}
export interface ArTextFeedProperties {
    textItems: ArTextItem[];
    articlesByTitle: any;
}
export interface ArMrssItem {
    guid: string;
    link: string;
    title: string;
    pubDate: string;
    duration: string;
    fileSize: string;
    medium: string;
    type: string;
    url: string;
    filePath?: string;
}
export interface ArMrssFeedProperties {
    mrssItems: ArMrssItem[];
    title: string;
    playtime: string;
    ttl: string;
    assetList: Asset[];
}
export interface ArContentFeedItem {
    name: string;
    url: string;
    medium: string;
    hash: string;
}
export interface ArContentFeedProperties {
    contentItems: ArContentFeedItem[];
    assetList: Asset[];
}
export interface ArMediaFeedItem {
    filePath: string;
    medium: string;
}
export type ArDataFeed = ArTextFeed | ArMrssFeed | ArContentFeed;
export type ArTextFeed = ArDataFeedBase & ArTextFeedProperties;
export type ArMrssFeed = ArDataFeedBase & ArMrssFeedProperties;
export type ArContentFeed = ArDataFeedBase & ArContentFeedProperties;
export interface ArDataFeedMap {
    [dataFeedId: string]: ArDataFeed;
}

export type HSMList = HSM[];

export interface MediaListItem {
    filePath: string;
    contentItemType: ContentItemType;
}

export interface ArEventType {
    EventType: string;
    data?: any;
    EventData?: any;
}
export interface HSMStateData {
    nextState: HState | null;
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
export type ArFileLUT = {
    [fileName: string]: string;
};
export type LUT = {
    [key: string]: any;
};
export type SubscribedEvents = {
    [eventKey: string]: HState;
};
export type StateMachineShape = {};
export interface ArState {
    bsdm?: DmState;
    stateMachine?: StateMachineShape;
    stateName?: string;
}

export interface UserVariable {
    userVariableId: string;
    currentValue: DmParameterizedString;
}
export interface UserVariableMap {
    [userVariableId: string]: UserVariable;
}

export enum BsBrightSignPlayerErrorType {
    unknownError = 0,
    unexpectedError = 1,
    invalidParameters = 2,
    invalidOperation = 3,
    apiError = 4,
    invalidModel = 5
}
export class BsBrightSignPlayerError extends Error {
    name: string;
    type: BsBrightSignPlayerErrorType;
    constructor(type: BsBrightSignPlayerErrorType, reason?: string);
}
export function isBsBrightSignPlayerError(error: Error): error is BsBrightSignPlayerError;

export function initializeButtonPanels(): void;
export function setBpOutput(bpCommandData: DmBpOutputCommandData): void;

/** @private */
export const postVideoEnd: () => any;
/** @private */
export const processKeyPress: (key: any) => any;

export class HSM {
    hsmId: string;
    dispatchEvent: ((event: ArEventType) => void);
    topState: HState;
    activeState: HState | null;
    constructorHandler: (() => void) | null;
    initialPseudoStateHandler: () => (HState | null);
    initialized: boolean;
    constructor(hsmId: string, dispatchEvent: ((event: ArEventType) => void));
    constructorFunction(): void;
    hsmInitialize(): (dispatch: any) => Promise<unknown>;
    completeHsmInitialization(): (dispatch: any) => Promise<unknown>;
    hsmDispatch(event: ArEventType): (dispatch: any, getState: () => BsBrightSignPlayerState) => void;
}
export class HState {
    topState: HState;
    HStateEventHandler: (event: ArEventType, stateData: HSMStateData) => any;
    stateMachine: HSM;
    superState: HState;
    id: string;
    constructor(stateMachine: HSM, id: string);
}
export function STTopEventHandler(_: ArEventType, stateData: HSMStateData): (dispatch: any) => string;

