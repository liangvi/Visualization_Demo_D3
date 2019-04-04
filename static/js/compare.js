function drawChart(data) {
  
var width = 1000;
var height = 1000;

var margin = {
  top: 10,
  left: 10,
  right: 10,
  bottom: 10
};

var color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("#compare_chart").attr("width", width).attr("height", height);

console.log(data)
data = JSON.parse(data)

var xScale = d3.scaleBand()
.domain(data.map((d) => d.topic))
.rangeRound([margin.left, width-margin.right])
.padding(0.5);

var yScale = d3.scaleLinear()
.domain([0, 6000])
.range([height - margin.bottom, margin.top]);

var xAxis = svg.append("g")
.attr("transform", `translate(0, ${height-margin.bottom})`)
.call(d3.axisBottom()
      .scale(xScale));

var yAxis = svg.append("g")
.attr("transform", `translate(${margin.left},0)`)
.call(d3.axisLeft()
      .scale(yScale));

var bar = svg.selectAll("rect")
.data(data)
.enter()
.append("rect")
.attr("x", function(d) {return xScale(d.topic);})
.attr("y", function(d) {return yScale(d.freq);})
.attr("width", xScale.bandwidth())
.attr("height", function(d) {
  return height - margin.bottom - yScale(d.freq);});

};
