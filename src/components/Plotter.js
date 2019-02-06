import React, { Component } from 'react';
import Histogram from './Histogram';

class Plotter extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Histogram
          data={this.props.data}
          riskToggle={this.props.riskToggle}
          impToggle={this.props.impToggle}
        />
    );
  }
}

export default Plotter;
