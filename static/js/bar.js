
var w = 500;
var h = 250;
var padding = 30;

d3.csv("/static/data/review_types.csv", function(data) {

//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
const dataset = data;

var xScale = d3.scaleLinear()
                     .domain([0, 5000])
										 .range([padding, w - padding]);

var yScale = d3.scaleLinear()
                     .domain([0,3000])
                     .range([h - padding, padding]);

var yAxis = d3.axisLeft()
                     .scale(yScale);
var xAxis = d3.axisBottom()
                     .scale(xScale);


var svg = d3.select("body")
            .append("svg")
            .attr("width", w)
            .attr("height", h);


svg.selectAll("circle")
   .data(dataset)
   .enter()
   .append("circle")
   .attr("cx", function(d) {
        return xScale(d.good);
   })
   .attr("cy", function(d) {
   			console.log(d.bad);
         return yScale(d.bad);
   })
   .attr("r", 4)
   .attr("fill", "orange");


svg.append("g")
    .call(yAxis)
    .attr("transform", "translate(30)");

svg.append("g")
    .call(xAxis)
    .attr("transform", "translate(0," + (h-20) + ")")


});
