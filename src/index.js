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
const zoom = d3.zoom()
      .scaleExtent([1, 8])
      .on("zoom", zoomed);
let tooltip = d3.select("div.tooltip");

let body = d3.select("body").node();
let svg = d3.select("svg")
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
		// console.log(event.layerX, event.layerY)
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
		clicked(event,d)
		let x = event.target.getBoundingClientRect().x
		let y = event.target.getBoundingClientRect().y
		// console.log(d3.select("#content").node().getBoundingClientRect())
		// console.log(event.target.getBoundingClientRect())
		// d3.select(event.currentTarget)
		// .transition()
		// .call(zoom.scaleTo, 3, [50,250])
    
	});
	// https://observablehq.com/@d3/zoom-to-bounding-box?collection=@d3/d3-zoom

	function zoomed(event) {
		const {transform} = event;
		g.attr("transform", transform);
		g.attr("stroke-width", 1 / transform.k);
	  }
	  function reset() {
		states.transition().style("fill", null);
		svg.transition().duration(750).call(
		  zoom.transform,
		  d3.zoomIdentity,
		  d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
		);
	  }

	  function clicked(event, d) {
		const [[x0, y0], [x1, y1]] = path.bounds(d);
		event.stopPropagation();
		states.transition().style("fill", null);
		d3.select(this).transition().style("fill", "red");
		svg.transition().duration(750).call(
		  zoom.transform,
		  d3.zoomIdentity
			.translate(width / 2, height / 2)
			.scale(Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
			.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
		  d3.pointer(event, svg.node())
		);
	  }