import React, { Component } from 'react';
import Histogram from './Histogram';
import Gallery from './Gallery';

import { histogram } from 'd3-array';
import orderBy from 'lodash/orderBy';

const bins = 100;

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { // global state
      riskToggle: false,
      impToggle: false,
      ascToggle: false,
      featNum: '0',
      data: null,
    };

    this.handleRisk = this.handleRisk.bind(this);
    this.handleImp = this.handleImp.bind(this);
    this.handleAsc = this.handleAsc.bind(this);
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

  handleData(i) {
    this.setState(state => ({
      featNum: String(i)
    }))
  }

  getData() {
    fetch('http://localhost:8888/'+this.state.featNum+'.json')
      .then(response => response.json())
      .then(data => this.setState(state => ({
        data: this.assignCoords(data)
      })));
  }

  assignCoords(data) {
    const sortOrder = this.state.ascToggle ? 'asc' : 'desc';
    const hist = histogram().value(d => d.featVal).thresholds(bins);
    let processData = hist(data).map(d => orderBy(d,'score',sortOrder));

    processData.forEach((histBin, binNum) => {
      histBin.forEach((item, idx) => {
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
    if (prevState.ascToggle !== this.state.ascToggle) {
      this.setState(state => ({
        data: this.assignCoords(this.state.data) //process w no re-fetch
      }))
    }
  }

  render() {
    const riskStyle = {
      backgroundColor: this.state.riskToggle ? 'white' : 'hsl(0, 0%, 15%)',
      color: this.state.riskToggle ? 'black' : 'hsl(0, 0%, 45%)',
    };
    const impStyle = {
      backgroundColor: this.state.impToggle ? 'white' : 'hsl(0, 0%, 15%)',
      color: this.state.impToggle ? 'black' : 'hsl(0, 0%, 45%)',
    };
    const ascStyle = {
      backgroundColor: this.state.ascToggle ? 'white' : 'hsl(0, 0%, 15%)',
      color: this.state.ascToggle ? 'black' : 'hsl(0, 0%, 45%)',
    };

    return (
      <div className='app'>
        <div className='field'>
          <Histogram
            data={this.state.data}
            riskToggle={this.state.riskToggle}
            impToggle={this.state.impToggle}
          />
        </div>
        <div className='panel'>
          <Gallery
            handleData={this.handleData}
          />
          <div className='buttonStrip'>
            <button onClick={this.handleRisk} style={riskStyle}>RISK</button>
            <button onClick={this.handleImp} style={impStyle}>IMP</button>
            <button onClick={this.handleAsc} style={ascStyle}>ASC</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
