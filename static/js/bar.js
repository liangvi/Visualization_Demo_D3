    var w = 500;
    var h = 200;
    var yA = 30;
    var padding=5
    var barPadding = 1;

      //http://learnjsdata.com/read_data.html
      //https://bl.ocks.org/caravinden/d04238c4c9770020ff6867ee92c7dac1
      //https://observablehq.com/@d3/bar-chart
    var xScale = d3.scaleLinear()
                       .domain([50,500])
                       .range([padding, w - padding]);


    var yScale = d3.scaleLinear()
                       .domain([40,250])
                       .range([h - padding, padding]);

    var xAxis = d3.axisBottom().scale(xScale);

    var yAxis = d3.axisLeft().scale(yScale);

    var x = d3.scaleBand()
	     .rangeRound([0, w])
	     .padding(padding);

    var y = d3.scaleLinear()
	     .rangeRound([h, 0]);

    var svg_bar = d3.select("#bar")
        .attr("width", w)
        .attr("height", h);

    console.log("TEST1");

    d3.csv("/static/data/review_types.csv", function (data) {
    //d3.csv("review_types.csv", function (data) {
      console.log("TEST4");

      console.log(data);
      console.log(data.good);
      console.log(data.bad);

      console.log("TEST3");

    svg_bar.selectAll("circle")
       .data(data)
       .enter()
       .append("circle")
       .attr("cx", function(d) {
            console.log(d.good)
            //return xScale(d.good) / 10;
            return 100;
       })
       .attr("cy", function(d) {
            console.log(d.bad)

            //return yScale(d.bad) / 10;
            return 100;
       })
       .attr("r", 40)
       .attr("fill", "orange");

//https://stackoverflow.com/questions/34691285/move-x-axis-to-coordinate-0-0-on-the-chart-with-d3-js
    svg_bar.append("g")
      .call(xAxis)
      .attr("transform", "translate(0,180)");

    svg_bar.append("g")
      .call(yAxis)
      .attr("transform", "translate(30)");
  });
