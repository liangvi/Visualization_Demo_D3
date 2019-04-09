    var w = 500;
    var h = 200;
    var yA = 30;
    var padding=5
    var barPadding = 1;

    d3.csv("/static/data/review_types.csv", function(data) {
      //http://learnjsdata.com/read_data.html
      //https://bl.ocks.org/caravinden/d04238c4c9770020ff6867ee92c7dac1

    var yScale = d3.scaleLinear()
                       .domain([padding,h])
                       .range([h - padding, padding]);

    var yAxis = d3.axisLeft()
                       .scale(yScale);

    var svg = d3.select("#bar").attr("width", width).attr("height", height);


    svg.selectAll("text")
     .data(data.good)
     .enter()
     .attr("x", function(d, i) {
          return i * ((w-yA) / data.good.length) + yA+10;
     })
     .attr("y", function(d) {
          return h - data.good;
     });

    svg.selectAll("rect")
     .data(data.good)
     .enter()
     .append("rect")
     .attr("fill", "orange")
     .attr("x", function(d, i) {
          return i * ((w-yA) / d.good.length) + yA;
     })
     .attr("y", function(d) {
          return yScale(d.good);
     })
     .attr("width", (w-yA) / d.good.length - barPadding)

     .attr("height", function(d) {
          return d.value;
     });

    svg.append("g")
      .call(yAxis)
      .attr("transform", "translate(30)");

    });
