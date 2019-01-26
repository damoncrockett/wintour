import React, { Component } from 'react';
import { select } from 'd3-selection';
import { togglesToColor } from '../lib/color';

const rectSide = 10;
const rectPad = 1;
const histW = 1000 + rectPad * 2;
const histH = 5000;

class Histogram extends Component {
  constructor(props) {
    super(props);
    this.drawHistogram = this.drawHistogram.bind(this);
  }

  componentDidUpdate() {
    this.drawHistogram();
  }

  drawHistogram() {
    const node = this.node;

    select(node)
      .selectAll('rect')
      .data(this.props.data)
      .enter()
      .append('rect');

    // I don't get why this works; they were entered on prevProps
    select(node)
      .selectAll('rect')
      .data(this.props.data)
      .exit()
      .remove();

    select(node)
      .selectAll('rect')
      .data(this.props.data)
      .attr('width', rectSide)
      .attr('height', rectSide)
      .attr('stroke', '#646464')
      .attr('x', d => d.x * rectSide + rectPad)
      .attr('y', d => histH - d.y * rectSide - rectSide - rectPad)
      .attr('fill', d => (
        togglesToColor(
          this.props.impToggle ? d.imp : null,
          this.props.riskToggle ? d.score : null
        )
      ));

    window.scrollTo( 0, histH ); // to keep equator in same visual spot
  }

  render() {
    return <svg ref={node => this.node = node} width={histW} height={histH} />;
  }
}

export default Histogram;
