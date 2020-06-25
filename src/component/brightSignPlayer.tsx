import * as React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { Dispatch } from 'redux';
import { DmState } from '@brightsign/bsdatamodel';
import { loadPresentationData } from '../controller/appController';
import { BsBspNonThunkAction, BspSchedule } from '../type';
import { getAutoschedule } from '../selector';
import { isNil } from 'lodash';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

export interface BrightSignPlayerProps {
  autoschedule: BspSchedule;
  bsdm: DmState;
  onLoadPresentationData: () => BsBspNonThunkAction;
}

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

class BrightSignPlayerComponent extends React.Component<BrightSignPlayerProps> {

  state: object;

  constructor(props: BrightSignPlayerProps) {
    super(props);
  }

  componentDidMount() {
    this.props.onLoadPresentationData();
  }

  render() {
    // postMessage={this.props.postMessage}
    if (isNil(this.props.autoschedule)) {
      return (
        <div>Pizza cooking</div>
      );
    } else {
      return (
        <div>Pizza served</div>
      );
    }
  }
}

// -----------------------------------------------------------------------
// Container
// -----------------------------------------------------------------------

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return bindActionCreators({
    onLoadPresentationData: loadPresentationData,
  }, dispatch);
};

function mapStateToProps(state: any) {
  return {
    bsdm: state.bsdm,
    autoschedule: getAutoschedule(state),
  };
}

export const BrightSignPlayer = connect(mapStateToProps, mapDispatchToProps)(BrightSignPlayerComponent);
