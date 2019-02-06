import React, { Component } from 'react';
import Fetcher from './Fetcher';
import { select } from 'd3-selection';
import feattable from '../assets/json/feattable.json';
import zipObject from 'lodash/zipObject';
import sampleSize from 'lodash/sampleSize';

let rTypes = new Set(feattable.map(d => d.rType));
rTypes = Array.from(rTypes);

const colors = [
  '#e6194B','#3cb44b','#ffe119','#4363d8','#f58231','#42d4f4','#f032e6',
  '#fabebe','#469990','#e6beff','#9A6324','#fffac8','#800000','#aaffc3',
];

const colorMap = zipObject(rTypes, sampleSize(colors, colors.length));
const rectSide = 10;
const rectPad = 1;
const margin = {top: 10, right: 10, bottom: 10, left: 10};

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
    this.handleBins = this.handleBins.bind(this);
    this.drawFeatGallery = this.drawFeatGallery.bind(this);
    this.svgNode = React.createRef();
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

  handleBins(e) {
    this.setState({bins: e.target.value});
  }

  drawFeatGallery() {
    const svgNode = this.svgNode.current;

    select(svgNode)
      .attr('class', 'panel');

    select(svgNode)
      .selectAll('g.gallery')
      .data([0])
      .enter()
      .append('g')
      .attr('class', 'gallery')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    select(svgNode)
      .select('g.gallery')
      .selectAll('rect')
      .data(feattable)
      .enter()
      .append('rect')
      .attr('class', 'gallery')
      .attr('width', rectSide)
      .attr('height', rectSide)
      .attr('stroke', 'hsl(0, 0%, 15%)')
      .attr('rx', rectSide * .15)
      .attr('ry', rectSide * .15)
      .attr('x', d => d.x * (rectSide + rectPad) + rectPad)
      .attr('y', d => d.y * (rectSide + rectPad) + rectPad)
      .attr('fill', d => colorMap[d.rType])
      .on('click', (d, i) => {
        this.setState(state => ({
          featNum: String(i)
        }))
      });
  }

  componentDidMount() {
    this.drawFeatGallery();
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
        <svg
          ref={this.svgNode}
          width={518+margin.left+margin.right}
          height={353+margin.top+margin.bottom}
        />
      </div>
    );
  }
}

export default Handler;
