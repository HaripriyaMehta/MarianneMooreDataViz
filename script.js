var map = L.map('map').setView([0, 0], 2);
map.setMaxBounds([[80, -190], [-80, 190]]);
map.setMinZoom(2);
var osmLayer = new L.TileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { noWrap: true
}).addTo(map);