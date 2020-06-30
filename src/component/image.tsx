import * as React from 'react';
import { isNil } from 'lodash';
import isomorphicPath from 'isomorphic-path';

// import { Dispatch } from 'redux';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getPoolFilePath } from '../selector';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

/** @internal */
export interface ImageProps {
  fileName: string;
  filePath: string;
  // src: string;
  width: number;
  height: number;
}

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

export class ImageComponent extends React.Component<ImageProps> {
  render() {
    const src: string = isomorphicPath.join('file://', this.props.filePath);

    if (isNil(this.props.width)) {
      return (
        <img
          src={src}
        />
      );
    } else {
      return (
        <img
          src={src}
          width={this.props.width.toString()}
          height={this.props.height.toString()}
        />
      );
    }
  }
}

// -----------------------------------------------------------------------
// Container
// -----------------------------------------------------------------------

const mapStateToProps = (state: any, ownProps: any): any => {
  return {
    fileName: ownProps.fileName,
    filePath: getPoolFilePath(state, ownProps.fileName),
    // src: ownProps.src,
    width: ownProps.width,
    height: ownProps.height,
  };
};

export const Image = connect(mapStateToProps)(ImageComponent);
