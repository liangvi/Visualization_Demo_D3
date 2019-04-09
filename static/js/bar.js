    var w = 500;
    var h = 200;
    var yA = 30;
    var padding=5
    var barPadding = 1;

    data = d3.csv("/static/data/review_types.csv", ({bad, good, index}) => ({category: index, value: +good})).sort((a, b) => b.value - a.value)
      //http://learnjsdata.com/read_data.html
      //https://bl.ocks.org/caravinden/d04238c4c9770020ff6867ee92c7dac1
      //https://observablehq.com/@d3/bar-chart

    var yScale = d3.scaleLinear()
                       .domain([padding,h])
                       .range([h - padding, padding]);

    var yAxis = d3.axisLeft()
                       .scale(yScale);

    var svg = d3.select("#bar").attr("width", width).attr("height", height);


    svg.append("g")
      .attr("fill", "steelblue")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.category))
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value))
      .attr("width", x.bandwidth());

  svg.append("g")
      .call(xAxis);

  svg.append("g")
      .call(yAxis);

  return svg.node();
