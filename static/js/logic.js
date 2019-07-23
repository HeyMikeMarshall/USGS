var query1 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
var query7 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
var query30 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"


var map = L.map("map", {
  center: [39.0902, -96.7129],
  zoom: 5
});

// var tiles = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "mapbox.streets",
//   accessToken: API_KEY
// })

var Esri_WorldGrayCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
	maxZoom: 16
}).addTo(map);

var magbin0 = L.layerGroup();
var magbin1 = L.layerGroup();
var magbin2 = L.layerGroup();
var magbin3 = L.layerGroup();
var magbin4 = L.layerGroup();
var magbin5 = L.layerGroup();
var faultlines = L.layerGroup();


var baselayers = {

}

var overlays = {
    "Magnitude < 2.5":magbin0,
    "Magnitude 2.5 - 5.5":magbin1,
    "Magnitude 5.5 - 6":magbin2,
    "Magnitude 6 - 7":magbin3,
    "Magnitude 7 - 8":magbin4,
    "Magnitude > 8":magbin5,
    "Fault Lines":faultlines
}

var layerControl = L.control.layers(baselayers, overlays).addTo(map);

function createFaultFeatures() {
  d3.json('static/js/PB2002_boundaries.json', function(data){
    L.geoJSON(data).addTo(faultlines)})
    faultlines.addTo(map);
  }


function createQuakeFeatures(data) {
  console.log(data)
  var feats = data.features;
  
  for (var i = 0; i < feats.length; i++) {
    
    var lng = feats[i].geometry.coordinates[0]
    var lat = feats[i].geometry.coordinates[1]
    var mag = feats[i].properties.mag
    var title = feats[i].properties.title
    function circlecol(mag) {
      var binfo;
      if (mag < 2.5) {
        binfo = {circcolor: "#24a800",
                 tgtbin: magbin0}
      }
      else if (mag >= 2.5 && mag < 5.5) {
        binfo = {circcolor: "#ffff00",
        tgtbin: magbin1}
      }
      else if (mag >= 5.5 && mag < 6 ) {
        binfo = {circcolor:"#ffd000",
        tgtbin: magbin2}
      }
      else if (mag >= 6 && mag < 7) {
        binfo = {circcolor: "#ff9900",
        tgtbin: magbin3}
      }
      else if (mag >= 7 && mag < 8) {
        binfo = {circcolor: "#ff0000",
        tgtbin: magbin4}
      }
      else if (mag >= 8) {
        binfo = {circcolor: "#000",
        tgtbin: magbin5}
      }
      return binfo;
      };
    
    var binfo = circlecol(mag)
    var color = binfo['circcolor']
    var lyrgrp = binfo['tgtbin']

    L.circle([lat, lng], {
      color: color,
      fillColor: color,
      fillOpacity: 0.75,
      radius: (10 ** mag)
    }).addTo(lyrgrp)
      .bindPopup(title);

    
  }

};

magbin0.addTo(map)
magbin1.addTo(map)
magbin2.addTo(map)
magbin3.addTo(map)
magbin4.addTo(map)
magbin5.addTo(map)

function querySelect(query) {
  d3.json(query, function(data) {
    createQuakeFeatures(data);
});}

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = ["less than 2.5", "2.5 - 5.5", "5.5 - 6", "6 - 7", "7 - 8", "greater than 8"],
        colors = ["mag0", "mag1", "mag2", "mag3", "mag4", "mag5" ];
    
    div.innerHTML = "<b>Magnitude</b><br>"
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            grades[i] + '<div class="legend-box ' + colors[i] +'"' + "></div>" +'<br><br>';
    }

    return div;
};

legend.addTo(map);


















createFaultFeatures()
querySelect(query7);
