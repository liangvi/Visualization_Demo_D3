function drawChart(data, chartID, chartName) {

  var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50
  };
  var overallWidth = document.getElementById(chartID).clientWidth;
  var overallHeight = overallWidth * 1.236;
  var width = overallWidth - margin.left - margin.right;
  var height = overallHeight - margin.top - margin.bottom;

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  var svg = d3
    .select("#" + chartID)
    .append("svg")
    .attr("width", overallWidth)
    .attr("height", overallHeight)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  console.log(data)
  data = JSON.parse(data)

  var xScale = d3.scaleBand()
    .domain(data.map((d) => d.topic))
    .rangeRound([0, width])
    .padding(0.3);

  var yScale = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) {
      return d.freq;
    })])
    .range([height, margin.top]);

  var xAxis = svg.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(-20)");

  var yAxis = svg.append("g")
    .call(d3.axisLeft(yScale));


  svg
    .append('text')
    .attr('class', 'label')
    .attr('x', -(height / 2) - margin.left)
    .attr('y', 0 - margin.left)
    .attr('transform', 'rotate(-90)')
    .attr('text-anchor', 'middle')
    .text('Frequency')

  svg.append('text')
    .attr('class', 'label')
    .attr('x', width / 2 + margin.left)
    .attr('y', height + margin.left * 1.7)
    .attr('text-anchor', 'middle')
    .text('Topics')

  svg.append('text')
    .attr('class', 'title')
    .attr('x', width / 2 + margin.left)
    .attr('y', 40)
    .attr('text-anchor', 'middle')
    .text(chartName)

  const barGroups = svg.selectAll()
    .data(data)
    .enter()
    .append('g')

  barGroups.append("rect")
    .attr('class', 'bar')
    .attr("x", function(d) {
      return xScale(d.topic);
    })
    .attr("y", function(d) {
      return yScale(d.freq);
    })
    .attr("width", xScale.bandwidth())
    .attr("height", function(d) {
      return height - yScale(d.freq);
    })
    .on('mouseenter', function(actual, i) {
      d3.selectAll('.value')
        .attr('opacity', 0)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 0.6)
        .attr('x', (d) => xScale(d.topic) - 5)
        .attr('width', xScale.bandwidth() + 10)

      barGroups.append('text')
        .attr('class', 'divergence')
        .attr('x', (d) => xScale(d.topic) + xScale.bandwidth() / 2)
        .attr('y', (d) => yScale(d.freq) + 30)
        .attr('font-size',"12px")
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
        .text((d, idx) => {
          const divergence = (d.freq - actual.freq)
          let text = ''
          if (divergence > 0) text += '+'
          text += `${divergence}`
          text += `${divergence}`
          return idx !== i ? text : '';
        })

    })
    .on('mouseleave', function() {
      d3.selectAll('.value')
        .attr('opacity', 1)

      d3.select(this)
        .transition()
        .duration(300)
        .attr('opacity', 1)
        .attr('x', (d) => xScale(d.topic))
        .attr('width', xScale.bandwidth())
        
      svg.selectAll('.divergence').remove()
    })

    barGroups 
      .append('text')
      .attr('class', 'value')
      .attr('x', (d) => xScale(d.topic) + xScale.bandwidth() / 2)
      .attr('y', (d) => yScale(d.freq) + 30)
      .attr('font-size',"12px")
      .attr('fill', 'white')
      .attr('text-anchor', 'middle')
      .text((d) => `${d.freq}`)
};

function drawPage(overallData, goodData, badData) {
  drawChart(overallData, "overallChart", 'Review Topic Comparison');
  drawChart(goodData, "goodChart", 'Good Review Topic Comparison (4 Stars or More)');
  drawChart(badData, "badChart", 'Bad Review Topic Comparison (2 Stars or Less)' );
};

function resize(chartID) {
  width = document.getElementById(chartID).clientWidth;
  height = width * 1.236;
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