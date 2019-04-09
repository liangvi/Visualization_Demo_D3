    var w = 500;
    var h = 200;
    var yA = 30;
    var padding=5
    var barPadding = 1;

    d3.csv("/static/data/review_types.csv", function(d) {
      //http://learnjsdata.com/read_data.html
      return {
        type: d.index,
        good: d.good,
        bad: d.bad
      };
    }).then(function(data) {

    var yScale = d3.scaleLinear()
                       .domain([padding,h])
                       .range([h - padding, padding]);

    var yAxis = d3.axisLeft()
                       .scale(yScale);

    var svg = d3.select("#bar").attr("width", width).attr("height", height);


    svg.selectAll("text")
     .data(d.good)
     .enter()
     .append("text")
     .text(function(d) {
          return d.key;
     })
     .attr("font-size", "12px")
     //https://website.education.wisc.edu/~swu28/d3t/concept.html
     .on("mouseover", function(d) {
      d3.select(this).transition()
          .attr("font-size", "22px")
          .text(function(d) {
              return d.value;
          })
     })
     .on("mouseout", function(d) {
      d3.select(this).transition()
          .attr("font-size", "12px")
          .text(function(d) {
              return d.key;
          })
      })
     .attr("text-anchor", "right")
     .attr("x", function(d, i) {
          return i * ((w-yA) / d.good.length) + yA+10;
     })
     .attr("y", function(d) {
          return h - d.value;
     });

    svg.selectAll("rect")
     .data(d.good)
     .enter()
     .append("rect")
     .attr("fill", "orange")
     .attr("x", function(d, i) {
          return i * ((w-yA) / d.good.length) + yA;
     })
     .attr("y", function(d) {
          return yScale(d.value);
     })
     .attr("width", (w-yA) / d.good.length - barPadding)

     .attr("height", function(d) {
          return d.value;
     });

    svg.append("g")
      .call(yAxis)
      .attr("transform", "translate(30)");

    });
