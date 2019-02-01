import React, { Component } from 'react';
import { select } from 'd3-selection';
import { min, max } from 'd3-array';
import { togglesToFill } from '../lib/color';

class Histogram extends Component {
  constructor(props) {
    super(props);
    this.drawHistogram = this.drawHistogram.bind(this);
    this.setRectAttr = this.setRectAttr.bind(this);
    this.svgNode = React.createRef();
    this.state = {
      histH: null,
      histW: null,
      rectSide: null,
      rectPad: null,
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
    const binMin = min(this.props.data.map(d => d.x));
    const binMax = max(this.props.data.map(d => d.x));
    const bins = binMax - binMin + 1;
    const baseWidth = 1000; //hard-code based on common screen resolutions
    const rectSide = baseWidth / bins;
    const rectPad = rectSide * 0.1;

    this.setState(state => ({
      rectSide: rectSide,
      rectPad: rectPad,
      histW: (rectSide + rectPad) * bins,
      histH: max(this.props.data.map(d => (
        d.y * (rectSide + rectPad) + rectSide
      )))
    }));
  }

  drawHistogram() {
    const svgNode = this.svgNode.current;

    // This selection is non-empty only the first time
    select(svgNode)
      .selectAll('rect')
      .data(this.props.data)
      .enter()
      .append('rect')
      .attr('stroke', 'hsl(0, 0%, 15%)')
      .attr('title', d => d.id);

/*
    My data is always the same length, but I leave
    the exit selection below for formal reasons.
    And it may eventually be necessary.
*/

/*
    select(svgNode)
      .selectAll('rect')
      .data(this.props.data)
      .exit()
      .remove();
*/

    select(svgNode)
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
      window.scrollTo( 0, this.state.histH );
    }

  render() {
    return <svg
             ref={this.svgNode}
             width={this.state.histW}
             height={this.state.histH}
           />;
  }
}

export default Histogram;
