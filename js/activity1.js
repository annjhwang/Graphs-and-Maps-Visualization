
var width = 400,
    height = 400;

var svg = d3.select("#chart-area").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 300)
    .attr("y", 300);


// 1) INITIALIZE FORCE-LAYOUT


// Load data
d3.json("data/airports.json", function(data) {
	console.log(data);

  	// 2a) DEFINE 'NODES' AND 'EDGES'
	var nodes = data["nodes"];
	var links = data["links"];
	console.log(nodes);
	console.log(links);
	
  	// 2b) START RUNNING THE SIMULATION
	var force = d3.layout.force()     
		.size([width, height])
		.linkDistance(50)
		.friction(0.9)
		.charge(-30)
		.gravity(0.1)
	    .theta(0.8)
	    .alpha(0.1);

	force     
		.nodes(nodes)     
		.links(links);

	force.start();

  	// 3) DRAW THE LINKS (SVG LINE)

	var edge = svg.selectAll(".links")
		.data(data.links)
		.enter().append("line")
		.attr("class", "link")
		.attr("stroke-width", 1.5)
		.attr("stroke", "black");

  	// 4) DRAW THE NODES (SVG CIRCLE)
	var node = svg.selectAll(".node")         
		.data(nodes)     
		.enter().append("circle")         
		.attr("class", "node")         
		.attr("r", 5)     
		.attr("fill", function(d){
			if(d.country == "United States")
				return "blue";
			else
				return "red";
		});



  // 5) LISTEN TO THE 'TICK' EVENT AND UPDATE THE X/Y COORDINATES FOR ALL ELEMENTS

	force.on("tick", function() {
    // Update node coordinates     
    	node         
    		.attr("cx", function(d) { return d.x; })         
    		.attr("cy", function(d) { return d.y; });
    // Update edge coordinates     
    	edge.attr("x1", function(d) { return d.source.x; })
	        .attr("y1", function(d) { return d.source.y; })
	        .attr("x2", function(d) { return d.target.x; })
	        .attr("y2", function(d) { return d.target.y; });
	});

	node.call(force.drag);

	node.append("title")   
		.text(function(d) { return d.name; });



});