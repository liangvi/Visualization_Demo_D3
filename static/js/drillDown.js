function drawDrillDown() {
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


//var color = d3.scaleOrdinal(d3.schemeCategory10);

var activeCity;

var svgD = d3.select("#drill")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("/static/data/star_types_filtered.csv", function(data) {
  var dataset = data;
  //const dataset = data.filter(row => row.category == "Pizza");

  // set the ranges
  var x = d3.scaleBand()
  					.domain(dataset.map(function(d) { return d.star; }))
            .range([0, width]);
  var y = d3.scaleLinear()
 					  .domain([0, d3.max(dataset, function(d) { return d.count/4; })])
            .range([height, 0]);


var barWidth = 10;

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
      .attr("y", function(d) { return y(d.count/4); })
      .style("fill", function(d) { return color(d.city);})
      .attr("height", function(d) { return height - y(d.count/4) })
      .on("mouseover", function(d) {
        activeCity = d.city;
        svgD.selectAll(".bar")
        .attr("stroke", function(d) {
            if (d.city == activeCity) {
                return "black";
            } else return "none";
        })
        .attr("opacity", function(d)  {
           if (d.city == activeCity) {
                return 1.0
           } else return 0.5
        })
        d3.select("#city")
            .selectAll("circle")
            .attr("r", function(d) {
                if (d.index == activeCity) return 10;
                else return 5;
            })
            .attr("opacity", function(d) {
                if (d.index == activeCity) {
                    return 1.0
               } else return 0.5
            })
           .attr("stroke", function(d) {
                if (d.index == activeCity) {
                    return "black";
                } else return "none";
            })
      })

     .on("mouseout", function(d) {
       svgD.selectAll(".bar")
           .attr("stroke", "none")
           .attr("opacity", 1.0)

       d3.select("#city")
           .selectAll("circle")
           .attr("r", 5)
           .attr("stroke", "none")
           .attr("opacity", 1.0)
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
            .attr("x", width - 10)
            .attr("width", 10)
            .attr("height", 18)
            .style("fill", color);

        legend.append("text")
            .attr("x", width - 12)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

           });
}
