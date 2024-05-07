import * as d3 from 'd3'
import mass from './data/mass.json'
import topojson from 'topojson'
import Papa from 'papaparse'
import coords from './data/listings.json'

import { sliderBottom, sliderTop } from 'd3-simple-slider'
let geojson = mass
import * as fs from 'fs'
let file = './data/median_counties_price.csv'
let file2 = './data/data.csv'
const data = d3.csv(file2, (data) => {
  return data
})
let county_list = [
  'Barnstable',
  'Berkshire',
  'Bristol',
  'Dukes',
  'Essex',
  'Franklin',
  'Hampden',
  'Hampshire',
  'Middlesex',
  'Nantucket',
  'Norfolk',
  'Plymouth',
  'Suffolk',
  'Worcester',
]

let projection = d3
  .geoEquirectangular()
  .center([-71.0589, 42.3601])
  .fitSize([1300, 800], geojson)

let geoGenerator = d3.geoPath().projection(projection)
function update(geojson) {
  let u = d3.select('#content g.map').selectAll('path').data(geojson.features)
  // console.log(u)
  u.enter()
    .append('path')
    .attr('d', geoGenerator)
    .attr('county', (d) => d.properties.NAME)
}

let states = d3.select('g.map')
update(geojson)
let path = geoGenerator
d3.select('#content g.map').selectAll('path')

// function handleZoom(e) {

//   d3.select('svg g').attr('transform', e.transform)
// }
const zoom = d3.zoom().scaleExtent([0.9, 6.5]).on('zoom', zoomed)
let tooltip = d3.select('div.tooltip')

let svg = d3.select('svg')
let x = d3
  .select('#content g.map')
  .selectAll('path')
  .on('mouseenter', (event, d) => {
    d3.select(event.currentTarget).transition().duration('150')
    // .style('fill', '#eeeeee')
    tooltip.style('visibility', 'visible')
  })
  .on('mousemove', (event, d) => {
    tooltip
      .style('top', event.pageY - 50 + 'px')
      .style('left', event.pageX + 'px')
      .text(d.properties.NAME)
  })
  .on('mouseout', (event, d) => {
    d3.select(event.currentTarget).transition().duration('200')
    // .style('fill', '#fff7dd')
    tooltip.style('visibility', 'hidden')
  })
  .on('click', (event, d) => {
    clicked(event, d)
    // data.then(d=>{
    // })
  })

svg.call(zoom)
let g = d3.select('g.map')

function zoomed(event) {
  const { transform } = event
  // console.log(event)
  g.attr('transform', transform)
  g.attr('stroke-width', 1 / transform.k)
}

function reset() {
  states.transition().style('fill', null)
  svg
    .transition()
    .duration(750)
    .call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([width / 2, height / 2]),
    )
}
let width = d3.select('svg').node().getBBox().width
let height = d3.select('svg').node().getBBox().height

function clicked(event, d) {
  const [[x0, y0], [x1, y1]] = path.bounds(d)
  event.stopPropagation()
  // event.target.style('fill','red')
  data.then((da) => {
    var filteredArray = da.filter(function (obj) {
      return (
        obj.hasOwnProperty('county_name') &&
        obj.county_name.includes(d.properties.NAME.toLowerCase())
      )
    })
    // console.log(filteredArray);
    let dates = filteredArray.map((obj) => {
      return obj.month_date_yyyymm
    })
  })
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
          Math.min(6.5, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)),
        )
        // .translate(500,500),
        .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
      d3.pointer(event, svg.node()),
    )
}

// const slider = sliderTop().min(2016).max(2024).step(1).width(500);
const slider = sliderTop()
const slider2 = sliderTop()
slider.domain([2017, 2024])
slider.step(1).width(400)
slider.ticks(7)
slider.displayFormat(d3.format('.0f'))
slider2.step(1).width(400)
slider2.ticks(12)
slider2.tickValues([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])
slider2.domain([1, 12])
slider2.displayFormat(d3.format('02.0f'))
slider2.tickFormat(d3.format('02.0f'))
slider.tickFormat(d3.format('.0f'))

let yyyymm = '201701'
slider.on('onchange', (e) => {
  yyyy = e
})
slider2.on('onchange', (e) => {
  mm = String(e).padStart(2, '0')
})
slider.on('end', (e) => {
  yyyymm = e.toString() + yyyymm.slice(4, 6)
  updateCurrentListing(data)
})
slider2.on('end', (e) => {
  yyyymm = yyyymm.slice(0, 4) + String(e).padStart(2, '0')
  updateCurrentListing(data)
})
const gg = d3
  .select('div.slider')
  .append('svg')
  .attr('width', 500)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,40)')
const ggg = d3
  .select('div.slider2')
  .append('svg')
  .attr('width', 500)
  .attr('height', 100)
  .append('g')
  .attr('transform', 'translate(30,40)')
gg.call(slider)
ggg.call(slider2)
for (const [key, value] of Object.entries(coords)) {
  if (value.hasOwnProperty('coords')) {
    states
      .append('circle')
      .attr('r', Math.log(value.listings.replace(',', '')))
      .attr('transform', function () {
        return 'translate(' + projection(value.coords) + ')'
      })
      .style('fill', 'rgba(0,200,200, 0.7)')
      .on('click', (event, d) => {
        console.log(value.town, value.listings)

        // let p = d3.select(`path[county="Bristol"]`)
        // console.log(
        //   d3.polygonContains(
        //     mass.features[2].geometry.coordinates[1][0].concat(mass.features[2].geometry.coordinates[0][0]),
        //     value.coords,
        //   ),
        // )
        // console.log("checking "+ value.coords)
        // console.log(mass.features[2].geometry.coordinates[0].length)
        // console.log(mass.features[0].geometry.coordinates[0].length)

        // console.log(event.currentTarget)
      })
      .on('mouseover', (event, d) => {
        d3.select('#content')
          .append('div')
          .text(value.town + ': ' + value.listings + ' active listings')
          .classed('cities-tooltip', true)
      })
      .on('mouseout', (event, d) => {
        d3.select('#content').select('div').remove()
      })
  }
}

function getListingPrice(yyyymm, county, data) {
  // console.log(yyyymm, county)
  return data.then((d) => {
    let a = d.find((obj) => {
      return (
        obj.month_date_yyyymm == yyyymm &&
        obj.county_name.includes(county.toLowerCase())
      )
    })
    return a
  })
}

// let plot = d3.select("scatterplot")

function updateCurrentListing(data) {
  getListingPrice(yyyymm, currentCounty, data).then((x) => {
    if (x != null) {
      d3.select('.median_listing_price').text(`$ ${x.median_listing_price}`)
    } else {
      d3.select('.median_listing_price').text('Price unavailable')
    }
  })
}

let currentCounty = 'Hampden'
let dropdown = d3.select('.selection').on('change', (e) => {
  currentCounty = dropdown.node().value

  updateCurrentListing(data)
})

// let x1 = {};

// const data2 = d3.csv("./data/listings2.csv", (d) => {
// 	x1[d.town] = {
//     town: d.town,
//     listings: d.listings,
//     coords: coords[d.town].coords
//    };
// 	// coords[d.town].listings = data.listings
// 	// console.log(coords)
// 	console.log(x1);
// });
// map the # of listings per county vs median price

//how many listings per county
let mp = {} // county : [{town : ...}]

// check if each towns coords is in a county, then assign it to that county
for (const [key, value] of Object.entries(coords)) {
  // let p = d3.select(`path[county="${county_list[ct]}"]`)
  // for every county, check if curr city coords is in it
  for (let i = 0; i < 14; i++) {
    if (
      d3.polygonContains(
        mass.features[i].geometry.coordinates.length == 1
          ? mass.features[i].geometry.coordinates[0]
          : mass.features[i].geometry.coordinates[0][0].concat(
              mass.features[i].geometry.coordinates[1][0],
            ),
        value.coords,
      )
    ) {
      let county_name = mass.features[i].properties.NAME

      if (mp.hasOwnProperty(county_name)) {
        mp[mass.features[i].properties.NAME].push(value)
      } else {
        let d = [value]
        mp[county_name] = d
      }
    }
    // console.log(mass.features[i].properties.NAME)
  }
}
// console.log(mp)
let county_listings = {} // county : # of listings
for (let county in mp) {
  if (mp.hasOwnProperty(county)) {
    const towns = mp[county]
    let listingsCount = 0
    towns.forEach((townObj) => {
      listingsCount += parseInt(townObj.listings)
    })
    county_listings[county] = listingsCount
  }
}
// console.log(county_listings)

// x is county listings ,  y is median price of that county
// price / listings reprents
// set the dimensions and margins of the graph
var margin = { top: 10, right: 30, bottom: 30, left: 60 },
  w = 460 - margin.left - margin.right,
  h = 400 - margin.top - margin.bottom

// append the svg object to the body of the page
var sp = d3
  .select('#scatterplot')
  .append('svg')
  .attr('width', w + margin.left + margin.right)
  .attr('height', h + margin.top + margin.bottom)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
var xAxis = d3.scaleLinear().domain([0, 9200]).range([0, w])
sp.append('g')
  .attr('transform', 'translate(0,' + h + ')')
  .call(d3.axisBottom(xAxis))
var yAxis = d3.scaleLinear().domain([0, 5000000]).range([h, 0])
sp.append('g').call(d3.axisLeft(yAxis))

county_list.forEach((c) => {
  getListingPrice('202403', c, data).then((d) => {
    sp.append('g')
      // .selectAll("dot")
      .append('circle')
      .attr('cy', yAxis(d.median_listing_price))
      .attr('cx', xAxis(county_listings[c]))
      .attr('r', 3)
      .style('fill', '#69b3a2')
      .on('mouseover', (event, d) => {
        console.log(c)

        d3.select('#graphToolTip').style('visibility', 'visible')
      })
      .on('mouseout', (event, d) => {
        d3.select('#graphToolTip').style('visibility', 'hidden')
      })
      .on('mousemove', (event) => {
        d3.select('#graphToolTip')
          .style('top', event.pageY - 50 + 'px')
          .style('left', event.pageX + 'px')
          .text(`${c} county`)
      })

    console.log(c, county_listings[c], d.median_listing_price)
  })
})
// arr of objects where each object is {listings: 1234, price : 1234}
