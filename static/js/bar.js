    var w = 500;
    var h = 200;
    var yA = 30;
    var padding=5
    var barPadding = 1;

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

    var x = d3.scaleBand()
	     .rangeRound([0, w])
	     .padding(padding);

    var y = d3.scaleLinear()
	     .rangeRound([h, 0]);

    var svg_bar = d3.select("#bar").attr("width", w).attr("height", h);
    d3.csv("/static/data/review_types.csv").then(function (data) {
        x.domain(data.map(function (d) {
			       return d.index;
		    }));
        y.domain(data.map(function (d) {
			       return d.good;
		    }));



    svg_bar.append("g")
      .attr("fill", "steelblue")
      .selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", function (d) {
    		return x(d.index);
    	})
    	.attr("y", function (d) {
        return y(d.good);
	     })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
       		return h - y(Number(d.good));
      });

//https://stackoverflow.com/questions/34691285/move-x-axis-to-coordinate-0-0-on-the-chart-with-d3-js
    svg_bar.append("g")
      .call(xAxis)
      .attr("transform", "translate(0,200)");

    svg_bar.append("g")
      .call(yAxis)
      .attr("transform", "translate(30)");
  });
