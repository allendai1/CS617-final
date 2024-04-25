import Chart from 'chart.js/auto';
import * as d3 from "d3";
import * as topojson from "topojson";
let us = d3.json('https://d3js.org/us-10m.v2.json')
const path = d3.geoPath();
// Create an SVG element
var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

// Set the width and height attributes
svg.setAttribute("width", "960");
svg.setAttribute("height", "600");

// Add the SVG element to the DOM
document.body.appendChild(svg);
// us.then(x=>x))
// let data = topojson.feature(us, us.objects.states).features

// d3.select(svg)
// .append('g')
// .selectAll('path')
// .data(data)
// .enter()
// .append('path')
// .attr('d', path);


// async function logMovies() {
//     let state = 25; // Mass state number
//     let year = 2020; // 2018 - 2021
//     let link = `https://api.census.gov/data/timeseries/asm/area2017?get=NAME,GEO_ID,NAICS2017_LABEL,NAICS2017,YEAR,EMP2020,RCPTOT&for=state:${state}&time=${year}`

//     const response = await fetch(link,{mode: 'cors'});
//     const data = await response.json();

//     let config = {
//       type: 'bar',
//       data: {
//         labels: data.map(row => row[2]),
//         datasets: [
//           {
//             label: 'Output in $1000',
//             data: data.map(row => row[6])
//           }
//         ]
//       },
//       options : {
//         responsive: true,
//         layout:{
//           autoPadding : true,
//         },
//         backgroundColor: "#24B9DB",
        
//       },
//     };



//     new Chart(document.getElementById('manufacturing'), config);


    
//     let m_labels = data.map((e)=> {return e[2]}) // manufacturing labels

//     console.log(m_labels)
//   }
  
// logMovies();