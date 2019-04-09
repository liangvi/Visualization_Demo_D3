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

    var svg = d3.select("#bar")
        .append("svg")
        .append("g")
        .attr("width", w)
        .attr("height", h);

//http://bl.ocks.org/jfreels/6816504
//https://observablehq.com/@d3/scatterplot
    svg.append("g")
        .selectAll("circle")
        .data(data)
        .join("circle")
        .attr("cx", 50)
        .attr("cy", 60)
        .attr("r", 40000)
        .attr("fill", "green");

    svg.append("g")
        .call(xAxis)
        .attr("transform", "translate(0,180)");

    svg.append("g")
        .call(yAxis)
        .attr("transform", "translate(30)");
    console.log("TEST5");

    console.log(data);
    console.log(data.good);
    console.log(data.bad);

    console.log("TEST6");
  });
