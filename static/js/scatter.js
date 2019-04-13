
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
     .attr("fill", "orange");

     svg.selectAll("text")
      	.data(dataset)
      	.enter()
      	.append("text")
        .text(function(d) {
           return d.index;
        })
       .attr("x", function(d) {
           return xScale(d.good);
        })
        .attr("y", function(d) {
           return yScale(d.bad);
        })
        .attr("font-size", "2px")
        .attr("fill", "transparent")
        .on("mouseover", function(d) {
          d3.select(this).transition()
       		.attr("fill", "black")
           .attr("font-size", "12px")

        })
        .on("mouseout", function(d) {
          d3.select(this).transition()
       		  .attr("fill", "transparent")
             .attr("font-size", "10px")

        });


     //https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
  svg.append("g")
      .call(yAxis)
      .attr("transform", "translate(40)");

  svg.append("text")
      .attr("transform","translate(" + (w-450) + " ," + (h - 210) + ")")
  		.text("Bad Review Count");


  svg.append("g")
      .call(xAxis)
      .attr("transform", "translate(0," + (h-20) + ")");

  svg.append("text")
      .text("Good Review Count")
      .attr("transform","translate(" + (w-150) + " ," + (h - 25) + ")")

  svg.append("text")
      .text("Categories by Review Types")
      .attr("transform","translate(" + (w-250) + " ," + (h - 210) + ")")
  });
