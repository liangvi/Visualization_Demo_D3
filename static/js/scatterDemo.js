var width = 500;
var height = 500;

var margin = {
  top: 10,
  left: 10,
  right: 10,
  bottom: 10
};

var color = d3.scaleOrdinal(d3.schemeCategory10);

var svg = d3.select("#scatterDemo").attr("width", width).attr("height", height);

var data = [{x:10, y:10},
            {x:20, y:20},
            {x:20, y:30},
            {x:40, y:40},
            {x:50, y:50},
            {x:60, y:60}];

var xScale = d3.scaleLinear()
.domain([0, 100])
.range([margin.left, width-margin.right]);

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

var bar = svg.selectAll("circle")
.data(data)
.enter()
.append("circle")
.attr("cx", function(d) {return xScale(d.x);})
.attr("cy", function(d) {return yScale(d.y);})
.attr("r", 10)
.attr("fill", function(d,i){return color(i/10);});
