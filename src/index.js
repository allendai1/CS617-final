import * as d3 from "d3";
import mass from "../data/mass.json";
import topojson from "topojson"
let geojson = mass;




let projection = d3
	.geoEquirectangular()
	.center([-71.0589, 42.3601])
  .fitSize([1300,800], geojson)
	// .scale(12000)
	// .translate([1000, 250]);

let geoGenerator = d3.geoPath().projection(projection);

function update(geojson) {
	let u = d3.select("#content g.map").selectAll("path").data(geojson.features);

	u.enter().append("path").attr("d", geoGenerator);
}

update(geojson);

function handleZoom(e) {
	d3.select('svg g')
		.attr('transform', e.transform);
}
let zoom = d3.zoom()
	.scaleExtent([0.25, 10])
	.on('zoom', handleZoom);
let tooltip = d3.select("div.tooltip");

let body = d3.select("body").node();
let x = d3
	.select("#content g.map")
	.selectAll("path")
	.on("mouseenter", (event, d) => {
		d3.select(event.currentTarget)
			.transition()
			.duration("150")
			.style("fill", "#1F2C5C");
		tooltip.style("visibility", "visible");
	})
	.on("mousemove", (event, d) => {
		console.log(event.layerX, event.layerY)
		tooltip
			.style(
				"top",
				event.pageY-35 + "px"
			)
			.style("left", event.pageX + "px")
			.text(d.properties.NAME);
	})
	.on("mouseout", (event, d) => {
		d3.select(event.currentTarget)
			.transition()
			.duration("200")
			.style("fill", "#334892");
		tooltip.style("visibility", "hidden");
	})
	.on("click", (event, d) => {

		let x = d3.select("#content").node().getBoundingClientRect().x;
		let y = d3.select("#content").node().getBoundingClientRect().height;
		console.log(d3.select("#content").node().getBoundingClientRect())
		console.log(x,y)
		d3.select(event.currentTarget)
		.transition()
		.call(zoom.scaleTo, 3, [x-event.layerX,0])
    
	});
	