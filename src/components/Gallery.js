import React, { Component } from 'react';
import { select } from 'd3-selection';
import feattable from '../assets/json/feattable.json';
import range from 'lodash/range';
import zipObject from 'lodash/zipObject';
import sampleSize from 'lodash/sampleSize';

let rTypes = new Set(feattable.map(d => d.rType));
rTypes = Array.from(rTypes);

const hues = range(0, 330, 20);
const colors = hues.map(d => `hsl(${d}, 30%, 40%)`);
const colorMap = zipObject(rTypes, sampleSize(colors, rTypes.length));
const rectSide = 6;
const rectPad = 0.6;
const nCols = 47;
const nRows = 32;
const width = nCols * (rectSide + rectPad) + rectPad;
const height = nRows * (rectSide + rectPad) + rectPad;
const margin = {top: 12, right: 12, bottom: 3, left: 12};

class Gallery extends Component {
  constructor(props) {
    super(props);
    this.drawFeatGallery = this.drawFeatGallery.bind(this);
    this.svgNode = React.createRef();
  }

  drawFeatGallery() {
    const svgNode = this.svgNode.current;

    select(svgNode)
      .attr('class', 'gallery');

    select(svgNode)
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
      .attr('rx', rectSide * .15)
      .attr('ry', rectSide * .15)
      .attr('x', d => d.x * (rectSide + rectPad) + rectPad)
      .attr('y', d => d.y * (rectSide + rectPad) + rectPad)
      .attr('fill', d => colorMap[d.rType])
      .on('click', (d, i) => {this.props.handleData(i)});

  }

  componentDidMount() {
    this.drawFeatGallery();
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

export default Gallery;
