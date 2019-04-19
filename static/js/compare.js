function formatWords(list) {
    str = "<ul>"
    for (word in list) {
        str += " <li> "
        str += list[word]
        str += " </li>"
    }
    str += "</ul>"
    return str
}

function drawChart(data, keywords, chartID, chartName) {

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };
    var overallWidth = document.getElementById(chartID).clientWidth;
    var overallHeight = overallWidth * 0.8;
    var width = overallWidth - margin.left - margin.right;
    var height = overallHeight - margin.top - margin.bottom;
    
    data = JSON.parse(data)
    cols = Object.keys(data[0])
    var keys = cols.slice(1);
    var groupKey = cols[0];

    var svg = d3
        .select("#" + chartID)
        .append("svg")
        .attr("width", overallWidth)
        .attr("height", overallHeight)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var x0 = d3.scaleBand()
        .domain(data.map(d => d[groupKey]))
        .rangeRound([margin.left, width - margin.right])
        .paddingInner(0.1)
    var x1 = d3.scaleBand()
        .domain(keys)
        .rangeRound([0, x0.bandwidth()])
        .padding(0.05)

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d3.max(keys, key => d[key]))]).nice()
        .range([height, margin.top]);

    var xAxis = svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x0).tickSizeOuter(0))
        .selectAll("text")

    var yAxis = svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));

    var color = d3.scaleOrdinal().range(["#A07A19", "#AC30C0", "#EB9A72", "#BA86F5", "#EA22A8"]);


    var format = d3.format(".3n")
    div = d3.select("body")
        .append("div")
        .attr("class", "tooltip");

    svg.append("g")
        .selectAll("g")
        .data(data)
        .join("g")
        .attr("transform", d => `translate(${x0(d[groupKey])},0)`)
        .selectAll("rect")
        .data(d => keys.map(key => ({
            key,
            value: d[key],
            topic: d[groupKey]
        })))
        .join("rect")
        .attr("x", d => x1(d.key))
        .attr("y", d => yScale(d.value))
        .attr("width", x1.bandwidth())
        .attr("height", d => yScale(0) - yScale(d.value))
        .attr("fill", d => color(d.key))
        .on('mousemove', function(d) {
            svg.selectAll("rect").transition().style('opacity',0.5)
            div.style("display", "none");
            div
                .html("City:" + d.key + 
                    "</br>" + "Frequency:" + format(d.value) + 
                    "</br>" + "Topic:" + d.topic + 
                    "</br>" + "Topic Words:" + formatWords(keywords[d.topic]))
                .style("left", (d3.event.pageX + 12) + "px")
                .style("top", (d3.event.pageY - 10) + "px")
                .style("opacity", 1)
                .style("display", "block")
                .style("background-color","lightblue")
                .style("stroke", "black")
                .style("stroke-width",1);
            d3.select(this)
                .transition()
                .duration(300)
                .attr('stroke', "black")
                .attr('opacity', 1)

        })
        .on('mouseleave', function() {
            svg.selectAll("rect").transition().style('opacity',1)
            div.html(" ").style("display", "none");
            d3.select(this)
                .transition()
                .duration(300)
                .attr('opacity', 1)
                .attr('stroke', "none")

        });



    legend = svg => {
        const g = svg
            .attr("class", "legend")
            .attr("transform", `translate(${width}, ${margin.top})`)
            .attr("text-anchor", "end")
            .attr("font-family", "sans-serif")
            .attr("font-size", 12)
            .selectAll("g")
            .data(color.domain().slice().reverse())
            .join("g")
            .attr("transform", (d, i) => `translate(0,${i * 20})`);

        g.append("rect")
            .attr("x", -20)
            .attr("width", 20)
            .attr("height", 20)
            .attr("fill", color);

        g.append("text")
            .attr("x", -25)
            .attr("y", 10)
            .attr("dy", "0.35em")
            .text(d => d);
    }

    svg
        .append('text')
        .attr('class', 'ylabel')
        .attr('x', -(height / 2) - margin.left)
        .attr('y', 0)
        .attr('transform', 'rotate(-90)')
        .attr('text-anchor', 'middle')
        .text('Frequency')

    svg.append('text')
        .attr('class', 'xlabel')
        .attr('x', width / 2 + margin.left)
        .attr('y', height + (margin.bottom - 10))
        .attr('text-anchor', 'middle')
        .text('Topics')

    svg.append('text')
        .attr('class', 'title')
        .attr('x', width / 2 + margin.left)
        .attr('y', margin.top)
        .attr('text-anchor', 'middle')
        .text(chartName)

    svg.append("g")
        .call(legend);
};

function drawPage(overallData, goodData, badData, allkeywords, goodkeywords, badkeywords) {
    console.log(allkeywords);
    console.log(goodkeywords);
    console.log(badkeywords);
    
    drawChart(overallData, allkeywords, "overallChart", 'Review Topic Comparison');
    drawChart(goodData, goodkeywords, "goodChart", 'Good Review Topic Comparison (4 Stars or More)');
    drawChart(badData, badkeywords, "badChart", 'Bad Review Topic Comparison (2 Stars or Less)');
};


function resize(chartID) {
    width = document.getElementById(chartID).clientWidth;
    height = width * 0.8;
    d3.select('#' + chartID + 'svg')
        .attr('width', width)
        .attr('height', height);
};

function resizePage() {
    resize("overallChart");
    resize("goodChart");
    resize("badChart");
};

window.onresize = resizePage();

function resetData() {}