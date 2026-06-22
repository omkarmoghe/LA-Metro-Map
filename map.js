var map = L.map("map").setView([34.0522, -118.2437], 10);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  zoomControl: false,
  maxZoom: 16,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

fetch("/geo/lines.geojson")
  .then((response) => response.json())
  .then((routeGeo) => {
    L.geoJSON(routeGeo).addTo(map);
  });

fetch("/geo/stops.csv")
  .then((response) => response.text())
  .then((csv) => {
    const lines = csv.split("\n");
    const headers = lines[0].split(",");
    const latIdx = headers.indexOf("stop_lat");
    const lonIdx = headers.indexOf("stop_lon");
    const nameIdx = headers.indexOf("stop_name");

    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",");
      const lat = parseFloat(cols[latIdx]);
      const lon = parseFloat(cols[lonIdx]);
      if (!isNaN(lat) && !isNaN(lon)) {
        L.marker([lat, lon]).addTo(map).bindPopup(cols[nameIdx]);
      }
    }
  });
