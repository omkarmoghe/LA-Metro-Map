const ws = new WebSocket(
  "wss://api.metro.net/ws/LACMTA_Rail/vehicle_positions",
);

let trainMarkers = {};

ws.addEventListener("open", (event) => {
  connected = true;
});

ws.addEventListener("message", (event) => {
  const payload = JSON.parse(event.data);
  vehicleUpdate(payload);
});

ws.addEventListener("error", (event) => {
  console.error("WebSocket error:", event);
});

ws.addEventListener("close", (event) => {
  console.log(`WebSocket closed: ${event.code} ${event.reason}`);
});

function vehicleUpdate(payload) {
  if (!Object.hasOwn(trainMarkers, payload.id)) {
    const trainMarker = document.createElement("span");
    trainMarker.textContent = "🚈";
    trainMarkers[payload.id] = new maplibregl.Marker({
      element: trainMarker,
    });
  }

  trainMarkers[payload.id]
    .setLngLat([
      payload.vehicle.position.longitude,
      payload.vehicle.position.latitude,
    ])
    .addTo(map);
}
