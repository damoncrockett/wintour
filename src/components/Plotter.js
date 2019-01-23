import React, { Component } from 'react';
import Histogram from './Histogram';
import jsonData from '../assets/data/json/data.json';

class Plotter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {riskToggle: false, impToggle: false};
    this.handleRisk = this.handleRisk.bind(this);
    this.handleImp = this.handleImp.bind(this);
  }

  handleRisk() {
    this.setState(state => ({
      riskToggle: !state.riskToggle
    }));
  }

  handleImp() {
    this.setState(state => ({
      impToggle: !state.impToggle
    }));
  }

  render() {
    const riskToggle = this.state.riskToggle;
    const impToggle = this.state.impToggle;
    return (
      <div>
        <Histogram
          data={jsonData}
          riskToggle={riskToggle}
          impToggle={impToggle}
        />
        <button onClick={this.handleRisk}>
          {riskToggle ? 'RISK ON' : 'RISK OFF'}
        </button>
        <button onClick={this.handleImp}>
          {impToggle ? 'IMP ON' : 'IMP OFF'}
        </button>
      </div>
    );
  }
}

export default Plotter;
