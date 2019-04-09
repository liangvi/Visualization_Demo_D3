    var w = 500;
    var h = 200;
    var yA = 30;
    var padding=5
    var barPadding = 1;

    data = d3.csv("/static/data/review_types.csv", ({bad, good, index}) => ({category: index, value: +good}))
      //http://learnjsdata.com/read_data.html
      //https://bl.ocks.org/caravinden/d04238c4c9770020ff6867ee92c7dac1
      //https://observablehq.com/@d3/bar-chart

    var xScale = d3.scaleLinear()
                       .domain([padding,w])
                       .range([w - padding, padding]);


    var yScale = d3.scaleLinear()
                       .domain([padding,h])
                       .range([h - padding, padding]);

    var xAxis = d3.axisBottom().scale(xScale);

    var yAxis = d3.axisLeft().scale(yScale);

    var svg_bar = d3.select("#bar").attr("width", w).attr("height", h);


    svg_bar.append("g")
      .attr("fill", "steelblue")
    .selectAll("rect")
    .data(data)
    .join("rect")
      .attr("x", d => x(d.category))
      .attr("y", d => y(d.value))
      .attr("height", d => y(0) - y(d.value));

  svg_bar.append("g")
      .call(xAxis);

  svg_bar.append("g")
      .call(yAxis)
      .attr("transform", "translate(30)");
