function drawDrillDown() {
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var activeCity;

    var svgD = d3.select("#drill")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("/static/data/star_types_filtered.csv", function(data) {
        var dataset = data;
        //const dataset = data.filter(row => row.category == "Pizza");

        // set the ranges
        var x0 = d3.scaleBand()
            .domain(dataset.map(function(d) { return d.star; }))
            .rangeRound([0, width])
            .paddingInner(0.1);

//https://gist.github.com/mbostock/3887051
        var y = d3.scaleLinear()
            .domain([0, 400])
            .range([height, 0]);

        //https://medium.com/@vaibhavkumar_19430/how-to-create-a-grouped-bar-chart-in-d3-js-232c54f85894
        var x1 = d3.scaleBand()
            .domain(dataset.map(function(d) { return d.city; }))
            .rangeRound([0, x0.bandwidth()])
            .padding(0.05);

        svgD.selectAll(".bar")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("transform", d => `translate(${x0(d.star)},0)`)
            .attr("x", function(d) { return x1(d.city); })
            .attr("width", x1.bandwidth())
            .attr("y", function(d) { return y(d.count); })
            .style("fill", function(d) { return color(d.city); })
            .attr("height", function(d) { return height - y(d.count) })
            .on("mouseover", function(d) {
                activeCity = d.city;
                d3.select("#bar")
                  .selectAll(".bar")
                    .attr("fill", function(d) {
                        if (d.city == activeCity) {
                            return "orange";
                        } else return "black";
                    })
                      .attr("stroke", function(d) {
                        if (d.city == activeCity) {
                            return "black";
                        } else return "none";
                    })
                var format = d3.format(".3n")

                var mouseVal = d3.mouse(this);
                div.style("display", "none");
                div
                    .html("City:" + d.city + "</br>" + "Score:" + format(d.score))
                    .style("left", (d3.event.pageX + 12) + "px")
                    .style("top", (d3.event.pageY - 10) + "px")
                    .style("opacity", 1)
                    .style("display", "block");

                var activeBar = this;
                d3.select("#bar")
                  .selectAll(".bar").transition().style('opacity', function() {
                    return (this === activeBar) ? 1.0 : 0.5;
                });


                svgD.selectAll(".bar")
                    .attr("stroke", function(d) {
                        if (d.city == activeCity) {
                            return "black";
                        } else return "none";
                    })
                    .attr("opacity", function(d) {
                        if (d.city == activeCity) {
                            return 1.0
                        } else return 0.5
                    })
                var mouseVal = d3.mouse(this);
                div.style("display", "none");
                div.html("City:" + d.city + "</br>" + "Count:" + format(d.count))
                    .style("left", (d3.event.pageX + 12) + "px")
                    .style("top", (d3.event.pageY - 10) + "px")
                    .style("opacity", 1)
                    .style("display", "block")
                    .style("background-color", "lightblue")
                    .style("stroke", "black")
                    .style("stroke-width", 1);

                d3.select("#city")
                    .selectAll("circle")
                    .attr("r", function(d) {
                        if (d.index == activeCity) return 10;
                        else return 5;
                    })
                    .attr("opacity", function(d) {
                        if (d.index == activeCity) {
                            return 1.0
                        } else return 0.5
                    })
                    .attr("stroke", function(d) {
                        if (d.index == activeCity) {
                            return "black";
                        } else return "none";
                    })
            })
            .on("mouseout", function(d) {
              d3.select("#bar")
                .selectAll(".bar")
                .attr("fill", "black")
                .attr("stroke","none")
                .transition().style('opacity', 1.0);
                //.attr("width", x.bandwidth())

              div.html(" ").style("display", "none");
            //  svg.selectAll(".bar").transition().style('opacity', 1.0);

                svgD.selectAll(".bar")
                    .attr("stroke", "none")
                    .attr("opacity", 1.0)

                div.html(" ").style("display", "none");

                d3.select("#city")
                    .selectAll("circle")
                    .attr("r", 5)
                    .attr("stroke", "none")
                    .attr("opacity", 1.0)
            });

        // add the x Axis
        svgD.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x0));

        // add the y Axis
        svgD.append("g")
            .call(d3.axisLeft(y));

        // add graph label
        svgD.append("text")
            .attr("transform", "translate(" + 10 + " ," + 10 + ")")
            .text("Star Rating Distribution by City");

        svgD.append('text')
            .attr('class', 'xlabel')
            .attr('x', width / 2)
            .attr('y', height + 28)
            .attr('text-anchor', 'middle')
            .text('Star Rating')

        svgD.append('text')
            .attr('class', 'ylabel')
            .attr('x', -(height / 2))
            .attr('y', 10)
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .text('Frequency')

        var legend = svgD.selectAll(".legend")
            .data(color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


        legend.append("rect")
            .attr("x", width - 10)
            .attr("width", 10)
            .attr("height", 18)
            .style("fill", color);


        legend.append("text")
            .attr("x", width - 12)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; });

    });
}
