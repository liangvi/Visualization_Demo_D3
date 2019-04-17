function drawMap(json_file) {
  // Width and Height of the whole visualization
  var width = 700;
  var height = 580;

  // Create SVG
  var svg = d3.select( "body" )
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );

  // Append empty placeholder g element to the SVG
  // g will contain geometry elements
  var g = svg.append( "g" );

  // Width and Height of the whole visualization
  // Set Projection Parameters
  var albersProjection = d3.geoAlbers()
      .scale( 190000 )
      .rotate( [71.057,0] )
      .center( [0, 42.313] )
      .translate( [width/2,height/2] );

  // Create GeoPath function that uses built-in D3 functionality to turn
  // lat/lon coordinates into screen coordinates
  var geoPath = d3.geoPath()
      .projection( albersProjection );

      // Classic D3... Select non-existent elements, bind the data, append the elements, and apply attributes
  g.selectAll( "path" )
      //.data(neighborhoods_json.features )
      .data(json_file )
      .enter()
      .append( "path" )
      .attr( "fill", "#ccc" )
      .attr( "stroke", "#333")
      .attr( "d", geoPath );

  }
