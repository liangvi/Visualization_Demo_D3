//http://bl.ocks.org/weiglemc/6185069
//https://bl.ocks.org/sebg/6f7f1dd55e0c52ce5ee0dac2b2769f4b
//https://stackoverflow.com/questions/39626858/how-to-set-fixed-no-of-ticks-on-axis-in-d3-js

var w = 700;
var h = 250;
var padding = 30;

d3.csv("/static/data/review_types.csv", function(data) {
  //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
  const dataset = data;

//https://observablehq.com/@d3/color-schemes
  var color = d3.scaleOrdinal(d3.schemeDark2);

  var xScale = d3.scaleLinear()
                       .domain([0, 5000])
                       .range([padding, w - padding]);

  var yScale = d3.scaleLinear()
                       .domain([0,3000])
                       .range([h - padding, padding]);

  var yAxis = d3.axisLeft()
                       .scale(yScale)
                       .ticks(5);
  var xAxis = d3.axisBottom()
                       .scale(xScale);


  var svg = d3.select("#scatter")
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
           return yScale(d.bad);
     })
     .attr("r", 4)
     .style("fill", function(d) { return color(d.index);});

  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      legend.append("rect")
          .attr("x", w - 10)
          .attr("width", 10)
          .attr("height", 18)
          .style("fill", color);

      legend.append("text")
          .attr("x", w - 12)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d; });




     //https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
  svg.append("g")
      .call(yAxis)
      .attr("transform", "translate(40)");

  svg.append("text")
      .attr("transform","translate(" + 50 + " ," + (h - 210) + ")")
      .text("Bad Review Count");


  svg.append("g")
      .call(xAxis)
      .attr("transform", "translate(0," + (h-20) + ")");

  svg.append("text")
      .text("Good Review Count")
      .attr("transform","translate(" + (w-150) + " ," + (h - 25) + ")")

  svg.append("text")
      .text("Categories by Review Types")
      .attr("transform","translate(" + (w/2) + " ," + (h - 210) + ")")
  });
