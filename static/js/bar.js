//https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4
//https://stackoverflow.com/questions/46205118/how-to-sort-a-d3-bar-chart-based-on-an-array-of-objects-by-value-or-key


// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);

var svg = d3.select("#bar")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/static/data/states.csv", function(data) {
  data.sort(function(a, b) {
    return d3.descending(a.score, b.score);
  })
  x.domain(data.map(function(d) {
    return d.city;
  }));

  // Scale the range of the data in the domains
  x.domain(data.map(function(d) { return d.city; }));
  y.domain([d3.min(data, function(d) { return d.score; })-.1, d3.max(data, function(d) { return d.score; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      //.attr("class", "bar")
      .attr("class", function(d,i) { return "pt" + data.city; })
      .attr("x", function(d) { return x(d.city); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.score); })
      .attr("height", function(d) { return height - y(d.score)}
      .on("mouseover", function(d, i) {
          d3.selectAll("circle.pt" + i)
             .attr("fill", "Orchid")
             .attr("r", 10)
          d3.selectAll("rect.pt" + i)
             .attr("fill", "Orchid")
      })
      .on("mouseout", function(d, i) {
          d3.selectAll("circle.pt" + i)
             .attr("fill", "orange")
             .attr("r", 5)
          d3.selectAll("rect.pt" + i)
             .attr("fill", "orange")
        });

  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

});
