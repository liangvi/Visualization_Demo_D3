//http://bl.ocks.org/kbroman/ded6a0784706a109c3a5
//http://bl.ocks.org/mattykuch/40ba19de703632ea2afbbc5156b9471f

var w = 600;
var h = 250;
var padding = 30;
var activeCity; // Will be used for linked hovering
var barWidth = 50;


d3.csv("/static/data/city_review_types.csv", function(data) {
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


  var svg = d3.select("#city")
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
     .attr("r", 5)
     .attr("fill", "black")
     .on("mouseover", function(d) {
        activeCity = d.index;
        d3.selectAll("circle")
        	.attr("r", function(d) {
          if ( d.index == activeCity) return 10;
          else return 5;
        })
        .attr("fill", function(d) {
        if ( d.index == activeCity) return "orange";
        else return "black";
        })
        d3.selectAll(".bar")
        	.attr("fill", function(d) {
          if ( d.city == activeCity) return "orange";
          else return "black";
        })
          .attr('width', function(d) {
          if ( d.city == activeCity) return barWidth + 15;
          else return barWidth;
        });
        })
     .on("mouseout", function(d, i) {
        d3.selectAll("circle")
          .attr("fill", "black")
          .attr("r", 5)
        d3.selectAll(".bar")
          .attr("fill", "black")
          .attr("width", barWidth)
     });

     var legend = svg.selectAll(".legend")
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
      .text("Cities by Review Types")
      .attr("transform","translate(" + (w-250) + " ," + (h - 210) + ")")
  })
