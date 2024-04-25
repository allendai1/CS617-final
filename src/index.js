import Chart from 'chart.js/auto';
import * as d3 from "d3";
import * as topojson from "topojson";
import mass from "../data/mass.json"
import * as parseSVG from "parse-svg"

let projection = d3.geoEquirectangular().scale(300)
// projection.fitExtent([[0,0][900, 500]], mass);

let context = d3.select('#content canvas')
  .node()
  .getContext('2d');

  let geoGenerator = d3.geoPath()
  .projection(projection)
  .context(context);
  context.beginPath();
  geoGenerator({type: 'FeatureCollection', features: mass.features})
  context.stroke();
// let u = d3.select('#content g.map')
// .selectAll('path')
// .data(mass.features)
// .join('path')
// .attr('d', geoGenerator);
// console.log(u)





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