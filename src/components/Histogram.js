import React, { Component } from 'react';
import { select } from 'd3-selection';
import { min, max } from 'd3-array';
import { scaleLinear } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { togglesToFill } from '../lib/color';

const margin = {top: 40, right: 40, bottom: 40, left: 40};
const baseWidth = 800;
const tickPct = 0.2;

class Histogram extends Component {
  constructor(props) {
    super(props);
    this.drawHistogram = this.drawHistogram.bind(this);
    this.setRectAttr = this.setRectAttr.bind(this);
    this.drawAxisX = this.drawAxisX.bind(this);
    this.drawAxisY = this.drawAxisY.bind(this);
    this.svgNode = React.createRef();
    this.state = {
      rectSide: null,
      rectPad: null,
      svgH: null,
      svgW: null,
      histH: null,
      histW: null,
      maxY: null,
      trueBins: null,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop
    if (prevProps.data !== this.props.data) {
      this.setRectAttr();
    }
    // has to be outside conditional because buttons don't change props.data
    this.drawHistogram();
  }

  setRectAttr() {
    const binNums = this.props.data.map(d => d.x);
    const binMin = min(binNums);
    const binMax = max(binNums);
    const bins = binMax - binMin + 1;
    const rectSide = baseWidth / bins;
    const rectPad = rectSide * 0.1;
    const w = (rectSide + rectPad) * bins;
    const maxY = max(this.props.data.map(d => d.y));
    const h = maxY * (rectSide + rectPad) + rectSide;

    this.setState(state => ({
      rectSide: rectSide,
      rectPad: rectPad,
      svgW: w + margin.left + margin.right,
      svgH: h + margin.top + margin.bottom,
      histW: w,
      histH: h,
      maxY: maxY,
      trueBins: bins,
    }));
  }

  drawAxisX() {
    const featVals = this.props.data.map(d => d.featVal);
    const minFeatVal = min(featVals);
    const maxFeatVal = max(featVals);
    const histW = this.state.histW;
    const x = scaleLinear()
                .domain([min(featVals), max(featVals)])
                .range([0, histW]);
    return axisBottom(x).ticks(Math.round(this.state.trueBins * tickPct));
  }

  drawAxisY() {
    const y = scaleLinear()
                .domain([0, this.state.maxY])
                .range([this.state.histH, 0]);
    return axisLeft(y).ticks(Math.round(this.state.maxY * tickPct));
  }

  drawHistogram() {
    const svgNode = this.svgNode.current;
    const axisDrop = this.state.histH + this.state.rectPad;

    select(svgNode)
      .selectAll('g.xAxis')
      .data([0]) // bc enter selection, prevents appending new 'g' on re-render
      .enter()
      .append('g')
      .attr('class', 'xAxis'); // purely semantic

    select(svgNode)
      .select('g.xAxis') // the g of class xAxis
      .attr('transform', `translate(${margin.left},${axisDrop+margin.top})`)
      .call(this.drawAxisX()); // re-draws on same g

    select(svgNode)
      .selectAll('g.yAxis')
      .data([0]) // bc enter selection, prevents appending new 'g' on re-render
      .enter()
      .append('g')
      .attr('class', 'yAxis'); // purely semantic

    select(svgNode)
      .select('g.yAxis') // the g of class xAxis
      .attr('transform',
            `translate(${margin.left},${margin.top})`)
      .call(this.drawAxisY()) // re-draws on same g
      .call(g => g.select(".domain").remove()); // removes vertical axis line

    select(svgNode)
      .selectAll('g.plotCanvas')
      .data([0]) // bc enter selection, prevents appending new 'g' on re-render
      .enter()
      .append('g')
      .attr('class', 'plotCanvas') // purely semantic
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // This selection is non-empty only the first time
    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect')
      .data(this.props.data)
      .enter()
      .append('rect')
      .attr('stroke', 'hsl(0, 0%, 15%)');

    select(svgNode)
      .select('g.plotCanvas')
      .selectAll('rect')
      .data(this.props.data)
      .attr('width', this.state.rectSide)
      .attr('height', this.state.rectSide)
      .attr('rx', String(this.state.rectSide * .15))
      .attr('ry', String(this.state.rectSide * .15))
      .attr('x', d => d.x * (this.state.rectSide + this.state.rectPad))
      .attr('y', d => (
        this.state.histH -
        d.y * (this.state.rectSide + this.state.rectPad) -
        this.state.rectSide
      ))
      .attr('fill', d => (
        togglesToFill(
          this.props.impToggle ? d.imp : null,
          this.props.riskToggle ? d.score : null
        )
      ))
      .attr('title', d => d.featVal);

      window.scrollTo( 0, this.state.svgH );
    }

  render() {
    return <svg
             ref={this.svgNode}
             width={this.state.svgW}
             height={this.state.svgH}
           />;
  }
}

export default Histogram;
