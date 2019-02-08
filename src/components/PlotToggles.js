import React, { Component } from 'react';
import { select } from 'd3-selection';

const margin = {top: 10, right: 10, bottom: 10, left: 10};
const width = 518;
const buttonWidth = 109;
const buttonHeight = 67.3657047737;
const buttonGap = (width - buttonWidth * 3) / 2;
const height = buttonHeight + margin.top + margin.bottom;

class PlotToggles extends Component {
  constructor(props) {
    super(props);
    this.drawButtons = this.drawButtons.bind(this);
    this.svgNode = React.createRef();
  }

  drawButtons() {
    const svgNode = this.svgNode.current;

    select(svgNode)
      .attr('class','toggleStrip'); // semantic

    select(svgNode)
      .selectAll('g.toggleStrip')
      .data([0])
      .enter()
      .append('g')
      .attr('class', 'toggleStrip')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    select(svgNode)
      .select('g.toggleStrip')
      .selectAll('rect.risk')
      .data([0])
      .enter()
      .append('rect')
      .attr('class', 'riskToggle')
      .attr('width', buttonWidth)
      .attr('height', buttonHeight)
      .attr('stroke', 'hsl(0, 0%, 75%)')
      .attr('rx', buttonHeight * .15)
      .attr('ry', buttonHeight * .15)
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', 'hsl(0, 0%, 15%)')
      .on('click', d => this.props.handleRisk());

    select(svgNode)
      .select('g.toggleStrip')
      .selectAll('rect.impToggle')
      .data([0])
      .enter()
      .append('rect')
      .attr('class', 'impToggle')
      .attr('width', buttonWidth)
      .attr('height', buttonHeight)
      .attr('stroke', 'hsl(0, 0%, 75%)')
      .attr('rx', buttonHeight * .15)
      .attr('ry', buttonHeight * .15)
      .attr('x', buttonWidth + buttonGap)
      .attr('y', 0)
      .attr('fill', 'hsl(0, 0%, 15%)')
      .on('click', d => this.props.handleImp());

    select(svgNode)
      .select('g.toggleStrip')
      .selectAll('rect.ascToggle')
      .data([0])
      .enter()
      .append('rect')
      .attr('class', 'ascToggle')
      .attr('width', buttonWidth)
      .attr('height', buttonHeight)
      .attr('stroke', 'hsl(0, 0%, 75%)')
      .attr('rx', buttonHeight * .15)
      .attr('ry', buttonHeight * .15)
      .attr('x', 2 * (buttonWidth + buttonGap))
      .attr('y', 0)
      .attr('fill', 'hsl(0, 0%, 15%)')
      .on('click', d => this.props.handleAsc());

  }

  componentDidMount() {
    this.drawButtons();
  }

  render() {
    return (
      <svg
        ref={this.svgNode}
        width={width+margin.left+margin.right}
        height={height+margin.top+margin.bottom}
      />
    );
  }
}

export default PlotToggles;
