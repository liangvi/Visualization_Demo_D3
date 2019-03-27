function drawChart(data) {
	var width = 500;
var height = 500;

var margin = {
  top: 10,
  left: 10,
  right: 10,
  bottom: 10
};

var svg = d3.select("#categories_chart").attr("width", width).attr("height", height);


console.log('data');
console.log(data);
var xScale = d3.scaleBand()
.range([margin.left, width-margin.right])
.domain(data.map((d) => d.category))
.padding(0.5);

var yScale = d3.scaleLinear()
.domain([0, 100])
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
.attr("x", function(d) {return xScale(d.category);})
.attr("y", function(d) {return yScale(d.value);})
.attr("width", xScale.bandwidth())
.attr("height", function(d) {
  return height - margin.bottom - yScale(d.value);});
}