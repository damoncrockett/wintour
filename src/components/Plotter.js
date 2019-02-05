import React, { Component } from 'react';
import Histogram from './Histogram';
import { histogram } from 'd3-array';
import orderBy from 'lodash/orderBy';

class Plotter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      riskToggle: false,
      impToggle: false,
      ascToggle: false,
      featNum: '0',
      bins: 100,
      data: null,
    };
    this.handleRisk = this.handleRisk.bind(this);
    this.handleImp = this.handleImp.bind(this);
    this.handleAsc = this.handleAsc.bind(this);
    this.handleBins = this.handleBins.bind(this);
    this.handleData = this.handleData.bind(this);
    this.getData = this.getData.bind(this);
    this.assignCoords = this.assignCoords.bind(this);
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

  getData() {
    // this ensures the user input will generate a valid filepath
    const validFilenames = Array.from(Array(1504).keys()).map(String);
    if (validFilenames.includes(this.state.featNum)) {
      fetch('http://localhost:8888/'+this.state.featNum+'.json')
        .then(response => response.json())
        .then(data => this.setState(state => ({
          data: this.assignCoords(data) // func setState maybe overkill here?
        })));
    }
  }

  assignCoords(data) {
    const sortOrder = this.state.ascToggle ? 'asc' : 'desc';
    const hist = histogram().value(d => d.featVal).thresholds(this.state.bins);
    let processData = hist(data).map(d => orderBy(d,'score',sortOrder));
    processData.forEach((histBin,binNum) => {
      histBin.forEach((item,idx) => {
        item.x = binNum;
        item.y = idx;
      })
    });

    return processData.flat();
  }

  componentDidMount() {
    this.getData();
  }

  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop from render to cDU
    if (prevState.featNum !== this.state.featNum) {
      this.getData();
    }
    if (prevState.bins !== this.state.bins &&
      this.state.bins >= 2 || // won't reprocess on empty string
      prevState.ascToggle !== this.state.ascToggle) {
      this.setState(state => ({
        data: this.assignCoords(this.state.data) //process w no re-fetch
      }))
    }
  }

  render() {
    const riskToggle = this.state.riskToggle;
    const impToggle = this.state.impToggle;
    const ascToggle = this.state.ascToggle;
    const featNum = this.state.featNum;
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
            value={featNum}
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
