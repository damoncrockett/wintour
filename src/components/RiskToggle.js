import React, { Component } from 'react';
import Histogram from './Histogram';
import jsonData from '../assets/data/json/data.json';

class RiskToggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    const isToggleOn = this.state.isToggleOn;
    return (
      <div>
        <Histogram
          data={jsonData}
          isToggleOn={isToggleOn} />
        <button onClick={this.handleClick}>
          {isToggleOn ? 'RISK ON' : 'RISK OFF'}
        </button>
      </div>
    );
  }
}

export default RiskToggle;
