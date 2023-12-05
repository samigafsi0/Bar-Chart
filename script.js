let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json"; // the JSON url
let dataBatch = {}; // The JSON data object
let theData = []; // The array of data we will work with
const req = new XMLHttpRequest(); //HTTP request to get the data

//graph dimensions
const width = 1000;
const height = 500;
const padding = 50;

// Axes variables
let xAxisScale;
let yAxisScale;
let xScale;
let yScale;
const svg = d3.select("svg");

req.open("GET", url, true);
req.onload = function () {
  dataBatch = JSON.parse(req.responseText);
  theData = dataBatch.data;
  console.log(theData.length);
  drawGraph(); // creates the general graph area with padding.
  createScales(); // creates the scales for the axis and graph
  drawAxis(); // creates the axis themselves
  drawBars(); // creates the bars
};
req.send();

const drawGraph = () => {
  svg.attr("width", width).attr("height", height);
};

const createScales = () => {
  xScale = d3
    .scaleLinear()
    .domain([0, theData.length - 1])
    .range([padding, width - padding]);

  yScale = d3
    .scaleLinear()
    .domain([0, d3.max(theData, (d) => d[1])])
    .range([0, height - 2 * padding]);

  let dates = theData.map((item) => {
    return new Date(item[0]);
  });

  xAxisScale = d3
    .scaleTime()
    .domain([d3.min(dates), d3.max(dates)])
    .range([padding, width - padding]);

  yAxisScale = d3
    .scaleLinear()
    .domain([0, d3.max(theData, (d) => d[1])])
    .range([height - padding, padding]);
};

const drawAxis = () => {
  svg
    .append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + (height - padding) + ")")
    .call(d3.axisBottom(xAxisScale));

  svg
    .append("g")
    .attr("id", "y-axis")
    .attr("transform", "translate(" + padding + ", 0)")
    .call(d3.axisLeft(yAxisScale));
};

const drawBars = () => {
  let tooltip = d3
    .select("#tooltip-box")
    .append("div")
    .attr("id", "tooltip")
    .style("visibility", "hidden")

  svg
    .selectAll("rect")
    .data(theData)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d, i) => {
      return xScale(i);
    })
    .attr("y", (d) => {
      return height - padding - yScale(d[1]);
    })
    .attr("width", (width - 2 * padding) / theData.length)
    .attr("height", (d) => yScale(d[1]))
    .attr("data-date", (d) => d[0])
    .attr("data-gdp", (d) => d[1])
    .on("mouseover", (d,i) => {
      tooltip.transition()
        .style("visibility", "visible");
      tooltip.text(i[0])
      document.querySelector('#tooltip').setAttribute('data-date', i[0])
    })
    .on("mouseout", () => {
      tooltip.transition().style("visibility", "hidden");
    });
};
