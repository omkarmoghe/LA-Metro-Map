let stopTimesByStopId = {};
let stopTimesByTripId = {};

fetch("geo/stop_times.csv")
  .then((response) => response.text())
  .then((csv) => {
    const [headerLine, ...dataLines] = csv.split("\n");
    const headers = headerLine.split(",");

    dataLines
      .map((line) =>
        Object.fromEntries(line.split(",").map((v, i) => [headers[i], v])),
      )
      .forEach((stopTime) => {
        // Index by stop_id
        if (Object.hasOwn(stopTimesByStopId, stopTime.stop_id)) {
          stopTimesByStopId[stopTime.stop_id].push(stopTime);
        } else {
          stopTimesByStopId[stopTime.stop_id] = [stopTime];
        }

        // Index by trip_id
        if (Object.hasOwn(stopTimesByTripId, stopTime.trip_id)) {
          stopTimesByTripId[stopTime.trip_id].push(stopTime);
        } else {
          stopTimesByTripId[stopTime.trip_id] = [stopTime];
        }
      });

    Alpine.store("stopTimes").byStopId = stopTimesByStopId;
    Alpine.store("stopTimes").byTripId = stopTimesByTripId;
  });
