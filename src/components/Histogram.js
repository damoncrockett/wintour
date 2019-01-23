import React, { Component } from 'react';
import { select } from 'd3-selection';
import { score2hsl } from './HSL';

const rectSide = 10;
const rectPad = 1;
const histW = 1000 + rectPad * 2;
const histH = 5000;

class Histogram extends Component {
  constructor(props) {
    super(props);
    this.drawHistogram = this.drawHistogram.bind(this);
    this.histRef = React.createRef();
  }

  componentDidMount() {
    this.drawHistogram()
  }

  componentDidUpdate() {
    this.drawHistogram()
  }

  drawHistogram() {
    const plot = select(this.histRef.current);

    plot
       .selectAll() //I'm not understanding why this is necessary
       .data(this.props.data)
       .enter()
       .append('rect')
       .attr('width', rectSide)
       .attr('height', rectSide)
       .attr('stroke', '#646464')
       .attr('fill', d => (this.props.isToggleOn) ? score2hsl(d.score): score2hsl(0.5))
       .attr('x', d => d.x * rectSide + rectPad)
       .attr('y', d => histH - d.y * rectSide - rectSide - rectPad);

    window.scrollTo( 0, histH ); // to keep equator in same visual spot
  }

  render() {
    return <svg ref={this.histRef} width={histW} height={histH} />;
  }
}

export default Histogram;
