import React, { Component } from 'react';
import { select } from 'd3-selection';

const margin = {top: 5, right: 20, bottom: 30, left: 20};
const width = 518;
const stripPad = 20;
const stripWidth = width - stripPad * 2;
const buttonWidth = 150;
const buttonHeight = 30;
const buttonGap = (stripWidth - buttonWidth * 3) / 2;
const buttonRadiusPct = 0.5;

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
      .append('g')
      .attr('class', 'toggleStrip')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    select(svgNode)
      .select('g.toggleStrip')
      .append('rect')
      .attr('id', 'riskToggle')
      .attr('width', buttonWidth)
      .attr('height', buttonHeight)
      .attr('rx', buttonHeight * buttonRadiusPct)
      .attr('ry', buttonHeight * buttonRadiusPct)
      .attr('x', stripPad)
      .attr('y', margin.top)
      .on('click', () => this.props.handleRisk());

    select(svgNode)
      .select('g.toggleStrip')
      .append('rect')
      .attr('id', 'impToggle')
      .attr('width', buttonWidth)
      .attr('height', buttonHeight)
      .attr('rx', buttonHeight * buttonRadiusPct)
      .attr('ry', buttonHeight * buttonRadiusPct)
      .attr('x', stripPad + buttonWidth + buttonGap)
      .attr('y', margin.top)
      .on('click', () => this.props.handleImp());

    select(svgNode)
      .select('g.toggleStrip')
      .append('rect')
      .attr('id', 'ascToggle')
      .attr('width', buttonWidth)
      .attr('height', buttonHeight)
      .attr('rx', buttonHeight * buttonRadiusPct)
      .attr('ry', buttonHeight * buttonRadiusPct)
      .attr('x', stripPad + 2 * (buttonWidth + buttonGap))
      .attr('y', margin.top)
      .on('click', () => this.props.handleAsc());

  }

  componentDidMount() {
    this.drawButtons();
  }

  render() {
    return (
      <svg
        ref={this.svgNode}
        width={width+margin.left+margin.right}
        height={buttonHeight+margin.top+margin.bottom}
      />
    );
  }
}

export default PlotToggles;
