import React, { Component } from 'react';
import Histogram from './Histogram';

class Plotter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Histogram
          data={this.props.data}
          riskToggle={this.props.riskToggle}
          impToggle={this.props.impToggle}
        />
      </div>
    );
  }
}

export default Plotter;
