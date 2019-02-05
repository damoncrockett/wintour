import React, { Component } from 'react';
import Fetcher from './Fetcher';

class Handler extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      riskToggle: false,
      impToggle: false,
      ascToggle: false,
      featNum: '0',
      bins: 100,
    };
    this.handleRisk = this.handleRisk.bind(this);
    this.handleImp = this.handleImp.bind(this);
    this.handleAsc = this.handleAsc.bind(this);
    this.handleData = this.handleData.bind(this);
    this.handleBins = this.handleBins.bind(this);
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

  handleAsc() {
    this.setState(state => ({
      ascToggle: !state.ascToggle
    }));
  }

  handleData(e) {
    this.setState({featNum: e.target.value});
  }

  handleBins(e) {
    this.setState({bins: e.target.value});
  }

  render() {
    return (
      <div>
        <Fetcher
          riskToggle={this.state.riskToggle}
          impToggle={this.state.impToggle}
          ascToggle={this.state.ascToggle}
          featNum={this.state.featNum}
          bins={this.state.bins}
        />
        <button onClick={this.handleRisk}>
          {this.state.riskToggle ? 'RISK ON' : 'RISK OFF'}
        </button>
        <button onClick={this.handleImp}>
          {this.state.impToggle ? 'IMP ON' : 'IMP OFF'}
        </button>
        <button onClick={this.handleAsc}>
          {this.state.ascToggle ? 'ASC' : 'DESC'}
        </button>
        <fieldset>
          <legend>Enter feature number:</legend>
          <input
            value={this.state.featNum}
            onChange={this.handleData} />
        </fieldset>
        <fieldset>
          <legend>Enter number of bins:</legend>
          <input
            value={this.state.bins}
            onChange={this.handleBins} />
        </fieldset>
      </div>
    );
  }
}

export default Handler;
