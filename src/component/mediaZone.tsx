import * as React from 'react';
// import { isNil } from 'lodash';
// import * as sizeOf from 'image-size';

// import isomorphicPath from 'isomorphic-path';

import { Image } from './index';

import {
  ContentItemType,
} from '@brightsign/bscore';

import { BsDmId } from '@brightsign/bsdatamodel';
import { DmMediaState } from '@brightsign/bsdatamodel';
import { DmState } from '@brightsign/bsdatamodel';
import { DmZone } from '@brightsign/bsdatamodel';
import { DmEvent } from '@brightsign/bsdatamodel';

import { DmMediaContentItem } from '@brightsign/bsdatamodel';

import {
  DmDerivedContentItem,
  dmGetMediaStateById,
  dmGetEventIdsForMediaState,
  dmGetEventById,
  DmcEvent,
} from '@brightsign/bsdatamodel';
import { connect } from 'react-redux';
import { isString } from 'lodash';
import { getActiveMediaStateId } from '../selector';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

/** @internal */
export interface MediaZoneProps {
  key: string;
  bsdm: DmState;
  zone: DmZone;
  width: number;
  height: number;
  activeMediaStateId: string;
  postBSPMessage: any;
}

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------
export default class MediaZoneComponent extends React.Component<MediaZoneProps> {

  constructor(props: MediaZoneProps) {
    super(props);
  }

  renderMediaItem(mediaState: DmMediaState, contentItem: DmDerivedContentItem) {

    const mediaContentItem: DmMediaContentItem = contentItem as DmMediaContentItem;

    // const fileId: string = mediaState.name;

    // const poolFilePath: string = getPoolFilePath(fileId);
    // const src: string = isomorphicPath.join('file://', poolFilePath);

    const mediaType: ContentItemType = mediaContentItem.type;

    switch (mediaType.toString().toLowerCase()) {
      case 'image': {
        return (
          <Image
            fileName={mediaState.name}
            width={this.props.width}
            height={this.props.height}
            // src={src}
          />
        );
      }
      default: {
        debugger;
      }
    }

    return null;
  }

  getEvents(bsdm: DmState, mediaStateId: string): DmEvent[] {

    let events: DmEvent[] = [];

    const eventIds: BsDmId[] = dmGetEventIdsForMediaState(bsdm, { id: mediaStateId });

    events = eventIds.map((eventId) => {
      return dmGetEventById(bsdm, { id: eventId }) as DmcEvent;
    });

    return events;
  }

  render() {

    const mediaStateId: string = this.props.activeMediaStateId;
    if (!isString(mediaStateId) || mediaStateId.length === 0) {
      return null;
    }
    const mediaState: DmMediaState = dmGetMediaStateById(this.props.bsdm, { id: mediaStateId }) as DmMediaState;
    const contentItem: DmDerivedContentItem = mediaState.contentItem;

    switch (contentItem.type) {
      case ContentItemType.Image: {
        return this.renderMediaItem(mediaState, contentItem as DmMediaContentItem);
      }
      default: {
        break;
      }
    }

    return null;
  }
}

// -----------------------------------------------------------------------
// Container
// -----------------------------------------------------------------------

const mapStateToProps = (state: any, ownProps: any): any => {
  return {
    key: state.key,
    bsdm: state.bsdm,
    zone: ownProps.zone,
    width: ownProps.width,
    height: ownProps.height,
    activeMediaStateId: getActiveMediaStateId(state, ownProps.zone.id),
  };
};

export const MediaZone = connect(mapStateToProps, null)(MediaZoneComponent);
