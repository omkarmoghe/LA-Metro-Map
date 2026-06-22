const map = L.map("map").setView([34.0522, -118.2437], 10);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  zoomControl: false,
  maxZoom: 16,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const icon = L.divIcon({
  html: "<span>Ⓜ️</span>",
  className: "station-icon",
});

fetch("/geo/lines.geojson")
  .then((response) => response.json())
  .then((routeGeo) => {
    L.geoJSON(routeGeo).addTo(map);
  });

fetch("/geo/stops.csv")
  .then((response) => response.text())
  .then((csv) => {
    const [headerLine, ...dataLines] = csv.split("\n");
    const headers = headerLine.split(",");

    const stops = dataLines
      .map((line) =>
        Object.fromEntries(line.split(",").map((v, i) => [headers[i], v])),
      )
      .forEach((stop) => {
        const stopLat = parseFloat(stop.stop_lat);
        const stopLon = parseFloat(stop.stop_lon);
        if (isNaN(stopLat) || isNaN(stopLon)) return;

        L.marker([stopLat, stopLon], { icon })
          .addTo(map)
          .bindPopup(stop.stop_name);
      });
  });
