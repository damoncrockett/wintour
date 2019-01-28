import React, { Component } from 'react';
import { select } from 'd3-selection';
import { max } from 'd3-array';
import { togglesToFill, togglesToStroke } from '../lib/color';

const rectSide = 10;
const rectPad = 1;
const histW = 1000 + rectPad * 2;

class Histogram extends Component {
  constructor(props) {
    super(props);
    this.drawHistogram = this.drawHistogram.bind(this);
    this.setHistHeight = this.setHistHeight.bind(this);
    this.svgNode = React.createRef();
    this.state = {histH: null};
  }

  componentDidUpdate(prevProps, prevState) {
    // conditional prevents infinite loop
    if (prevProps.data !== this.props.data) {
      this.setHistHeight();
    }
    // has to be outside conditional because buttons don't change props.data
    this.drawHistogram();
  }

  setHistHeight () {
    this.setState(state => ({
      histH: max(this.props.data.map(d => d.y * rectSide + rectSide + rectPad))
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
      .attr('width', rectSide)
      .attr('height', rectSide)
      .attr('stroke', '#646464');

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
      .attr('x', d => d.x * rectSide + rectPad)
      .attr('y', d => this.state.histH - d.y * rectSide - rectSide - rectPad)
      .attr('stroke', d => (
        togglesToStroke(
          this.props.impToggle ? d.imp : null,
        )
      ))
      .attr('fill', d => (
        togglesToFill(
          this.props.impToggle ? d.imp : null,
          this.props.riskToggle ? d.score : null
        )
      ));

    window.scrollTo( 0, this.state.histH ); // keep equator in same visual spot
  }

  render() {
    return <svg ref={this.svgNode} width={histW} height={this.state.histH} />;
  }
}

export default Histogram;
