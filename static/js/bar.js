var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 500 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var barWidth = 50;
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
  y.domain([d3.min(data, function(d) { return d.score-0.5; }), d3.max(data, function(d) { return d.score; })]);

  // append the rectangles for the bar chart
  svg.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.city); })
      .attr("width", barWidth)
      .attr("y", function(d) { return y(d.score); })
      .attr("height", function(d) { return height - y(d.score) })
      .on("mouseover", function(d) {
        activeCity = d.city;
        d3.selectAll(".bar")
        	.attr("fill", function(d) {
          if ( d.city == activeCity) return "orange";
          else return "black";
        })
        .attr("width", function(d) {
          if ( d.city == activeCity) return barWidth+15;
          else return barWidth;
        })

        d3.selectAll("circle")
        	.attr("r", function(d) {
          if ( d.index == activeCity) return 10;
          else return 5;
        })})

     .on("mouseout", function(d) {
        d3.selectAll("rect")
          .attr("fill", "black")
          .attr("width", barWidth)

        d3.selectAll("circle")
          .attr("fill", "black")
          .attr("r", 5)
        })
     });


  // add the x Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svg.append("g")
      .call(d3.axisLeft(y));

  // add graph label
  svg.append("text")
        .attr("transform","translate(" + 10 + " ," + (h - 260) + ")")
     		.text("Predicted Star Rating by City");
