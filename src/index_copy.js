import * as d3 from "d3";
import mass from "../data/mass.json";
import topojson from "topojson";
import Papa from "papaparse";
import { sliderBottom } from 'd3-simple-slider';
let geojson = mass;

let file = "../data/median_counties_price.csv";
let file2 = "../data/data.csv";
const data = d3.csv(file2, (data) => {
	return data;
});

let projection = d3
	.geoEquirectangular()
	.center([-71.0589, 42.3601])
	.fitSize([1300, 800], geojson);

let geoGenerator = d3.geoPath().projection(projection);
function update(geojson) {
	let u = d3.select("#content g.map").selectAll("path").data(geojson.features);

	u.enter().append("path").attr("d", geoGenerator);
}

let states = d3.select("g.map");
// console.log(states.transition())
update(geojson);
let path = geoGenerator;

// function handleZoom(e) {

//   d3.select('svg g').attr('transform', e.transform)
// }
const zoom = d3.zoom().scaleExtent([1, 6.5]).on("zoom", zoomed);
let tooltip = d3.select("div.tooltip");

let body = d3.select("body").node();
let svg = d3.select("svg");
let x = d3
	.select("#content g.map")
	.selectAll("path")
	.on("mouseenter", (event, d) => {
		d3.select(event.currentTarget).transition().duration("150");
		// .style('fill', '#eeeeee')
		tooltip.style("visibility", "visible");
	})
	.on("mousemove", (event, d) => {
		// console.log(event.layerX, event.layerY)
		tooltip
			.style("top", event.pageY - 40 + "px")
			.style("left", event.pageX + "px")
			.text(d.properties.NAME);
	})
	.on("mouseout", (event, d) => {
		d3.select(event.currentTarget).transition().duration("200");
		// .style('fill', '#fff7dd')
		tooltip.style("visibility", "hidden");
	})
	.on("click", (event, d) => {
		clicked(event, d);
		// data.then(d=>{
		//   console.log(d)
		// })
	});
var allGroup = ["yellow", "blue", "red", "green", "purple", "black"];
var dropdownButton = d3.select("#dataviz_builtWithD3");

// dropdownButton // Add a button
// 	.selectAll("myOptions") // Next 4 lines add 6 options = 6 colors
// 	.data(allGroup)
// 	.enter()
// 	.append("option")
// 	.text(function (d) {
// 		return d;
// 	}) // text showed in the menu
// 	.attr("value", function (d) {
// 		return d;
// 	})
// 	.append("select");
// let countyButtons = d3.select('#content g.map').selectAll('path')
// countyButtons.nodes().forEach(element => {
// 	d3.element.__data__.properties.NAME
// });
// console.log(countyButtons.nodes()[0].__data__.properties.NAME)
svg.call(zoom);
let g = d3.select("g.map");

function zoomed(event) {
	const { transform } = event;
	// console.log(event)
	g.attr("transform", transform);
	g.attr("stroke-width", 1 / transform.k);
}

function reset() {
	states.transition().style("fill", null);
	svg
		.transition()
		.duration(750)
		.call(
			zoom.transform,
			d3.zoomIdentity,
			d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
		);
}
let width = d3.select("svg").node().getBBox().width;
let height = d3.select("svg").node().getBBox().height;

function clicked(event, d) {
	const [[x0, y0], [x1, y1]] = path.bounds(d);
	event.stopPropagation();
	// event.target.style('fill','red')
	data.then((da) => {
		var filteredArray = da.filter(function (obj) {
			return (
				obj.hasOwnProperty("county_name") &&
				obj.county_name.includes(d.properties.NAME.toLowerCase())
			);
		});
		console.log(filteredArray);
		let dates = filteredArray.map((obj) => {
			return obj.month_date_yyyymm;
		});
		console.log(dates);
	});
	// mass.json county property ==
	// d3.select(event.target).style("fill",'white')
	// states.transition().style('fill', null)
	// d..transition().style('fill', 'red')
	svg
		.transition()
		.duration(700)
		.call(
			zoom.transform,
			d3.zoomIdentity
				.translate(width / 2, height / 2)
				.scale(
					Math.min(6.5, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
				)
				// .translate(500,500),
				.translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
			d3.pointer(event, svg.node())
		);
}

const slider = sliderBottom().min(0).max(10).step(1).width(300);
const gg = d3.select("div.slider")
.append('svg')
.attr('width', 500)
.attr('height', 100)
.append('g')
.attr('transform', 'translate(30,30)');
  


gg.call(slider)