const map = new maplibregl.Map({
  container: "map",
  style: "https://tiles.openfreemap.org/styles/positron",
  center: [-118.2437, 34.0522],
  zoom: 10,
});

map.on("load", () => {
  map.addControl(
    new maplibregl.GeolocateControl({
      showUserLocation: true,
      positionOptions: {
        enableHighAccuracy: true,
      },
    }),
  );

  fetch("geo/lines.geojson")
    .then((response) => response.json())
    .then((routeGeo) => {
      map.addSource("rail-lines", {
        type: "geojson",
        data: routeGeo,
      });
      map.addLayer({
        id: "rail-lines",
        type: "line",
        source: "rail-lines",
        paint: {
          "line-color": "#000000",
          "line-width": 3,
        },
      });
    });

  fetch("geo/stops.csv")
    .then((response) => response.text())
    .then((csv) => {
      const [headerLine, ...dataLines] = csv.split("\n");
      const headers = headerLine.split(",");

      const stops = dataLines
        .map((line) =>
          Object.fromEntries(line.split(",").map((v, i) => [headers[i], v])),
        )
        .forEach((stop) => {
          if (stop.location_type !== "1") return;

          const stopLon = parseFloat(stop.stop_lon);
          const stopLat = parseFloat(stop.stop_lat);
          if (isNaN(stopLat) || isNaN(stopLon)) return;

          const stopMarker = document.createElement("span");
          stopMarker.className = "stop-marker";
          stopMarker.textContent = "Ⓜ️";
          stopMarker.addEventListener("click", () => {
            Alpine.store("map").selectedStop = stop;
          });

          new maplibregl.Marker({ element: stopMarker })
            .setLngLat([stopLon, stopLat])
            .addTo(map);
        });
    });
});
