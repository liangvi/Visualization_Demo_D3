var width = 500;
var height = 500;

var margin = {
  top: 10,
  left: 10,
  right: 10,
  bottom: 10
};

var svg = d3.select("#barDemo").attr("width", width).attr("height", height);

var data = [{x:"A", y:10},
            {x:"B", y:20},
            {x:"C", y:30},
            {x:"D", y:40},
            {x:"E", y:50},
            {x:"F", y:60}];

var xScale = d3.scaleBand()
.domain(["A", "B", "C", "D", "E", "F"])
.rangeRound([margin.left, width-margin.right])
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
.attr("x", function(d) {return xScale(d.x);})
.attr("y", function(d) {return yScale(d.y);})
.attr("width", xScale.bandwidth())
.attr("height", function(d) {
  return height - margin.bottom - yScale(d.y);});