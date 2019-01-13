import { json } from 'd3-fetch'

json("data/json/data.json", function(data) {
    console.log(data);
});
