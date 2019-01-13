import { json } from 'd3-fetch'

d3.json("data/json/data.json", function(data) {
    console.log(data);
});
