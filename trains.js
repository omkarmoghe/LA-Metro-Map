const ws = new WebSocket(
  "wss://api.metro.net/ws/LACMTA_Rail/vehicle_positions",
);

ws.addEventListener("message", (event) => {
  console.log(`Websocket message: ${event.data.length}`);
});

ws.addEventListener("error", (event) => {
  console.error("WebSocket error:", event);
});

ws.addEventListener("close", (event) => {
  console.log(`WebSocket closed: ${event.code} ${event.reason}`);
});
