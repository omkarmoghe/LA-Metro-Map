var map = L.map("map").setView([34.0522, -118.2437], 10);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  zoomControl: false,
  maxZoom: 16,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

fetch("/geo/lines.geojson").then((response) => {
  var routeGeo = response.json();
  L.geoJSON(routeGeo).addTo(map);
});
