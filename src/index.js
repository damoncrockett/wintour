import { json } from 'd3-fetch'
import { select, selectAll } from 'd3-selection'

json("src/assets/data/json/data.json", function(data) {
    testView(data);
});

const rectSide = 10;
const rectPad = 1;

const testView = function(data) {
  const histWidth = 1000 + rectPad * 2;
  const histHeight = 5000;

  let svg = d3.select("body")
                .append("svg")
                .attr("width", histWidth)
                .attr("height", histHeight);

  let glyphs = svg.selectAll("rect")
                  .data(data)
                  .enter()
                  .append("rect")
                  .attr("width", rectSide)
                  .attr("height", rectSide)
                  .attr("stroke", "#646464");

  glyphs.attr("fill", function(data) {
    	      return 'hsl(0,0%,'+String(parseInt((1-data.score)*100))+'%)';
          })
          .attr("x", function(data) {
              return data.x * rectSide + rectPad;
          })
          .attr("y", function(data) {
              return histHeight - data.y * rectSide - rectSide - rectPad;
          })

    window.scrollTo( 0, 5000 ); // to keep equator in same visual spot
};
