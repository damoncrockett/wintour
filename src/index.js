import { json } from 'd3-fetch'
import { select } from 'd3-selection'

const rectSide = 10;
const rectPad = 1;
const histWidth = 1000 + rectPad * 2;
const histHeight = 5000;

json("src/assets/data/json/data.json").then( data => {
  const svg = select('body')
            .append('svg')
            .attr('width', histWidth)
            .attr('height', histHeight);

  svg.selectAll('rect')
     .data(data)
     .enter()
     .append('rect')
     .attr('width', rectSide)
     .attr('height', rectSide)
     .attr('stroke', '#646464')
     .attr('fill', d => score2hsl(d.score))
     .attr('x', d => d.x * rectSide + rectPad)
     .attr('y', d => histHeight - d.y * rectSide - rectSide - rectPad);

  window.scrollTo( 0, 5000 ); // to keep equator in same visual spot
});

const score2hsl = score => 'hsl(0,0%,'+String(parseInt((1-score)*100))+'%)';
