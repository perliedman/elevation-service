elevation-service
=================

Elevation data for your GeoJSON as a micro service. Yes, really!

You can try (or even use, for fun and profit) the service here: [http://data.cykelbanor.se/elevation/geojson](http://data.cykelbanor.se/elevation/geojson).

You might also be interested in [geojson-elevation](https://github.com/perliedman/geojson-elevation) and 
[node-hgt](https://github.com/perliedman/node-hgt), which this module builds upon.

## Installation and running

Clone this repo, install dependencies:

```
npm install
```

and fire it up:

```
node index.js
```

It runs on port 5001 for now.

Post a GeoJSON object to its only endpoint, `/geojson`, and you will get the same object back, but its
coordinates will have a third component containing elevation added.
