

var color = d3.scaleOrdinal(d3.schemeCategory10);
var width = 600;

var svgD = d3.select("#drill")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/static/data/drillDown.csv", function(data, c=activeCity) {

  const dataset = data.filter(city => data.city == c);

  // set the ranges
  var x = d3.scaleBand()
  					.domain(dataset.map(function(d) { return d.star; }))
            .range([0, width])
            .padding(0.1);
  var y = d3.scaleLinear()
 					  .domain([0, d3.max(dataset, function(d) { return d.count; })])
            .range([height, 0]);


  var legend = svg.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
        .attr("x", w - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

      legend.append("text")
        .attr("x", w - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });



  // append the rectangles for the bar chart
  svgD.selectAll(".bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d,i) { return i* x(d.star); })
      .attr("width", barWidth)
      .attr("y", function(d) { return y(d.count); })
      .style("fill", function(d) { return color(d.city);})

      .attr("height", function(d) { return height - y(d.count) });

  // add the x Axis
  svgD.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svgD.append("g")
      .call(d3.axisLeft(y));

  // add graph label
  svgD.append("text")
        .attr("transform","translate(" + 10 + " ," + (height - 260) + ")")
     		.text("Star Rating Distribution by City");
       });
