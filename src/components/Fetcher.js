import React, { Component } from 'react';
import Plotter from './Plotter';
import { histogram } from 'd3-array';
import orderBy from 'lodash/orderBy';

class Fetcher extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    };
    this.getData = this.getData.bind(this);
    this.assignCoords = this.assignCoords.bind(this);
  }

  getData() {
    // this ensures the user input will generate a valid filepath
    const validFilenames = Array.from(Array(1504).keys()).map(String);
    if (validFilenames.includes(this.props.featNum)) {
      fetch('http://localhost:8888/'+this.props.featNum+'.json')
        .then(response => response.json())
        .then(data => this.setState(state => ({
          data: this.assignCoords(data) // func setState maybe overkill here?
        })));
    }
  }

  assignCoords(data) {
    const sortOrder = this.props.ascToggle ? 'asc' : 'desc';
    const hist = histogram().value(d => d.featVal).thresholds(this.props.bins);
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
    if (prevProps.featNum !== this.props.featNum) {
      this.getData();
    }
    if (prevProps.bins !== this.props.bins &&
      this.props.bins >= 2 || // won't reprocess on empty string
      prevProps.ascToggle !== this.props.ascToggle) {
      this.setState(state => ({
        data: this.assignCoords(this.state.data) //process w no re-fetch
      }))
    }
  }

  render() {
    return (
      <div>
        <Plotter
          data={this.state.data}
          riskToggle={this.props.riskToggle}
          impToggle={this.props.impToggle}
        />
      </div>
    );
  }
}

export default Fetcher;
