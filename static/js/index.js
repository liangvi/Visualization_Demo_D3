function drawMap(data) {

  var map = d3.geomap.choropleth()
    .geofile('/d3-geomap/topojson/countries/USA.json')
    .projection(d3.geoAlbersUsa)
    .column('2012')
    .unitId('fips')
    .scale(1000)
    .legend(true);

    //d3.csv('venture_capital.csv', function(error, data) {
    map.draw(d3.select('#map').datum(data));
  //});
}
