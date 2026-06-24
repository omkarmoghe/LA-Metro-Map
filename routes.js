fetch("https://api.metro.net/LACMTA_Rail/route_overview")
  .then((response) => response.json())
  .then((routes) => {
    routes.forEach((route) => {
      Alpine.store("routes")[route.route_id] = route;
    });
  });
