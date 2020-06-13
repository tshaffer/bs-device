import * as React from 'react';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import { Dispatch } from 'redux';
import { DmState } from '@brightsign/bsdatamodel';

// -----------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------

export interface BrightSignPlayerProps {
  bsdm: DmState;
}

// -----------------------------------------------------------------------
// Component
// -----------------------------------------------------------------------

class BrightSignPlayerComponent extends React.Component<BrightSignPlayerProps> {

  state: object;

  constructor(props: BrightSignPlayerProps) {
    super(props);
  }

  render() {

    // postMessage={this.props.postMessage}
    return (
      <div>Pizza</div>
    );
  }
}

// -----------------------------------------------------------------------
// Container
// -----------------------------------------------------------------------

const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  return bindActionCreators({
  }, dispatch);
};

function mapStateToProps(state: any) {
  return {
    bsdm: state.bsdm,
  };
}

export const BrightSignPlayer = connect(mapStateToProps, mapDispatchToProps)(BrightSignPlayerComponent);
