    var w = 500;
    var h = 200;
    var yA = 30;
    var padding=5
    var barPadding = 1;

      //http://learnjsdata.com/read_data.html
      //https://bl.ocks.org/caravinden/d04238c4c9770020ff6867ee92c7dac1
      //https://observablehq.com/@d3/bar-chart
    d3.csv("/static/data/review_types.csv", function (data) {

    var xScale = d3.scaleLinear()
                       .domain([50,500])
                       .range([padding, w - padding]);


    var yScale = d3.scaleLinear()
                       .domain([40,250])
                       .range([h - padding, padding]);

    var xAxis = d3.axisBottom().scale(xScale);

    var yAxis = d3.axisLeft().scale(yScale);

    console.log("TEST1");


    var svg_bar = d3.select("#bar")
        .append("svg")
        .append("g")
        .attr("width", w)
        .attr("height", h);
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
            console.log("TEST5");
            console.log(d.good);
            console.log("TEST6");

              //return xScale(d.good) / 10;
          return 100;
         })
         .attr("cy", function(d) {
           console.log("TEST7");
           console.log(d.bad);
           console.log("TEST8");

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
