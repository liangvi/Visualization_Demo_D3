var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var barWidth = 5;

var color = d3.scaleOrdinal(d3.schemeCategory10);

var activeCity;

var svgD = d3.select("#drill")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/static/data/star_types_filtered.csv", function(data) {
  //const dataset = data;
  const dataset = data.filter(row => row.category == "Pizza");

  // set the ranges
  var x = d3.scaleBand()
  					.domain(dataset.map(function(d) { return d.star; }))
            .range([0, width]);
  var y = d3.scaleLinear()
 					  .domain([0, d3.max(dataset, function(d) { return d.count; })])
            .range([height, 0]);

  // append the rectangles for the bar chart
  svgD.selectAll(".bar")
      .data(dataset)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", function(d,i) {
        return i*5 + x(d.star);
       })
      .attr("width", barWidth)
      .attr("y", function(d) { return y(d.count/2); })
      .style("fill", function(d) { return color(d.city);})
      .attr("height", function(d) { return height - y(d.count/2) })
      .on("mouseover", function(d) {
        activeCity = d.city;
        d3.selectAll(".bar")
        	.attr("fill", function(d) {
          if ( d.city == activeCity) {
          	return "orange";
          }
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
        })
        d3.selectAll("circle")
        	.attr("fill", function(d) {
          if ( d.index == activeCity) return "orange";
          else return "black";
        })
      })

     .on("mouseout", function(d) {
        d3.selectAll("rect")
          .attr("fill", "black")
          .attr("width", barWidth)

        d3.selectAll("circle")
          .attr("fill", "black")
          .attr("r", 5)
        });

  // add the x Axis
  svgD.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  // add the y Axis
  svgD.append("g")
      .call(d3.axisLeft(y));

  // add graph label
  svgD.append("text")
        .attr("transform","translate(" + 10 + " ," + 10 + ")")
     		.text("Star Rating Distribution by City");

  var legend = svgD.selectAll(".legend")
        .data(color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
        .attr("x", width - 60)
        .attr("width", 60)
        .attr("height", 18)
        .style("fill", color);

      legend.append("text")
        .attr("x", width - 70)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d; });

           });
