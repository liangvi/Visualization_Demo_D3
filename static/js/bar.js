//https://bl.ocks.org/d3noob/bdf28027e0ce70bd132edc64f1dd7ea4
//https://stackoverflow.com/questions/46205118/how-to-sort-a-d3-bar-chart-based-on-an-array-of-objects-by-value-or-key
function drawBarChart() {
    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 600 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var activeCity;

    var svg = d3.select("#bar")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    d3.csv("/static/data/states.csv", function(data) {

        // set the ranges
        var x = d3.scaleBand()
            .domain(data.map(function(d) { return d.city; }))
            .range([0, width])
            .padding(0.1);
        var y = d3.scaleLinear()
            .domain([d3.min(data, function(d) { return d.score - 0.5; }), d3.max(data, function(d) { return d.score; })])
            .range([height, 0]);

        data.sort(function(a, b) {
            return d3.descending(a.score, b.score);
        })
        x.domain(data.map(function(d) {
            return d.city;
        }));

        var format = d3.format(".3n")
        div = d3.select("body")
            .append("div")
            .attr("class", "tooltip");
        // append the rectangles for the bar chart
        svg.selectAll(".bar")
            .data(data)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.city); })
            .attr("width", x.bandwidth())
            .attr("y", function(d) { return y(d.score); })
            .attr("height", function(d) { return height - y(d.score) })
            .on("mousemove", function(d) {
                activeCity = d.city;
                svg.selectAll(".bar")
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

                var mouseVal = d3.mouse(this);
                div.style("display", "none");
                div
                    .html("City:" + d.city + "</br>" + "Score:" + format(d.score))
                    .style("left", (d3.event.pageX + 12) + "px")
                    .style("top", (d3.event.pageY - 10) + "px")
                    .style("opacity", 1)
                    .style("display", "block");

                var activeBar = this;
                svg.selectAll(".bar").transition().style('opacity', function() {
                    return (this === activeBar) ? 1.0 : 0.5;
                });

                d3.select("#drill")
                    .selectAll(".bar")
                    .attr("stroke", function(d) {
                        if (d.city == activeCity) {
                            return "black";
                        } else return "none";
                    })
                    .attr("opacity", function(d)  {
                       if (d.city == activeCity) {
                            return 1.0
                       } else return 0.5
                    })
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
                svg.selectAll(".bar")
                    .attr("fill", "black")
                    .attr("stroke","none")
                    .attr("width", x.bandwidth())

                div.html(" ").style("display", "none");
                svg.selectAll(".bar").transition().style('opacity', 1.0);

                d3.select("#drill")
                    .selectAll(".bar")
                    .attr("stroke", "none")
                    .attr("opacity", 1.0)

                d3.select("#city")
                    .selectAll("circle")
                    .attr("fill", "black")
                    .attr("r", 5)
                    .attr("stroke", "none")
                    .attr("opacity", 1.0)
            })

        // add the x Axis
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // add the y Axis
        svg.append("g")
            .call(d3.axisLeft(y));

        // add graph label
        svg.append("text")
            .attr("transform", "translate(" + 10 + " ," + (h - 260) + ")")
            .text("Predicted Star Rating by City");
    });
}
