
var width = 1000,
    height = 600;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height);


/* mercator projection
var projection = d3.geo.mercator()     
	.translate([width / 2, height / 2])
	.scale(100);
*/

// projection using orthographic
var projection = d3.geo.orthographic()     
	.translate([width / 2, height / 2])
	.scale(300);

// creating path from projection
var path = d3.geo.path()     
	.projection(projection);

// load data in parallel via queue
queue()
    .defer(d3.json, "data/topo.json")
    .defer(d3.json, "data/airports.json")
    .await(createVisualization);

// 1) INITIALIZE FORCE-LAYOUT


// function to draw visualization
function createVisualization(error, data1, data2) {

    // test log of data
    console.log(data1);
    console.log(data2);

    // convert to GeoJSON (target object = 'states')
    var world = topojson.feature(data1, data1.objects.countries).features;

    // render the world by using the path generator
    svg.selectAll("path")
        .data(world)
        .enter().append("path")
        .attr("d", path)
        .attr("fill", "steelblue");

    // draw airports
    svg.selectAll(".node")
        .data(data2.nodes)
        .enter().append("circle")
        .attr("class", "node")
        .attr("r", 3)
        .attr("fill", function(d) {
            if (d.country == "United States") {
                return "yellow";
            }
            else
                return "red";
        })
        .attr("transform", function(d) {
            return "translate(" + projection([d.longitude, d.latitude]) + ")";
        });
}

