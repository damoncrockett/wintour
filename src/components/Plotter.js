import React, { Component } from 'react';
import Histogram from './Histogram';

class Plotter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      riskToggle: false,
      impToggle: false,
      ascToggle: false,
      n: '0',
      bins: 100,
      data: null,
    };
    this.handleRisk = this.handleRisk.bind(this);
    this.handleImp = this.handleImp.bind(this);
    this.handleAsc = this.handleAsc.bind(this);
    this.handleBins = this.handleBins.bind(this);
    this.handleData = this.handleData.bind(this);
    this.getData = this.getData.bind(this);
    this.processData = this.getData.bind(this);
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
    this.setState({n: e.target.value});
  }

  handleBins(e) {
    this.setState({bins: e.target.value});
  }

  getData() {
    // this ensures the user input will generate a valid filepath
    const validFilenames = Array.from(Array(1504).keys()).map(String);
    if (validFilenames.includes(this.state.n)) {
      fetch('http://localhost:8888/'+this.state.n+'.json')
        .then(response => response.json())
        .then(data => this.setState(state => ({
          data: data // functional setState maybe overkill here
        })));
    }
  }

  processData() {

  }

  componentDidMount() {
    this.getData()
  }

  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop from render to cDU
    if (prevState.n !== this.state.n) {
      this.getData()
    }
    if (prevState.bins !== this.state.bins ||
      prevState.ascToggle !== this.state.ascToggle) {
      this.processData()
    }
  }

  render() {
    const riskToggle = this.state.riskToggle;
    const impToggle = this.state.impToggle;
    const ascToggle = this.state.ascToggle;
    const n = this.state.n;
    const bins = this.state.bins;
    const jsonData = this.state.data;

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
        <button onClick={this.handleAsc}>
          {ascToggle ? 'ASC' : 'DESC'}
        </button>
        <fieldset>
          <legend>Enter feature number:</legend>
          <input
            value={n}
            onChange={this.handleData} />
        </fieldset>
        <fieldset>
          <legend>Enter number of bins:</legend>
          <input
            value={bins}
            onChange={this.handleBins} />
        </fieldset>
      </div>
    );
  }
}

export default Plotter;
