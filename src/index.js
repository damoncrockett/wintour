import { json } from 'd3-fetch'
import { select } from 'd3-selection'

const rectSide = 10;
const rectPad = 1;
const histWidth = 1000 + rectPad * 2;
const histHeight = 5000;

json("src/assets/data/json/data.json").then( data => {
  var svg = select("body")
              .append("svg")
              .attr("width", histWidth)
              .attr("height", histHeight);

  svg.selectAll("rect")
     .data(data)
     .enter()
     .append("rect")
     .attr("width", rectSide)
     .attr("height", rectSide)
     .attr("stroke", "#646464")
     .attr("fill", function(d) {
          return 'hsl(0,0%,'+String(parseInt((1-d.score)*100))+'%)';
        })
     .attr("x", function(d) {
          return d.x * rectSide + rectPad;
        })
     .attr("y", function(d) {
          return histHeight - d.y * rectSide - rectSide - rectPad;
        });

  window.scrollTo( 0, 5000 ); // to keep equator in same visual spot
});
