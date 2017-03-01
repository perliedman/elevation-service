elevation-service
=================

[![Greenkeeper badge](https://badges.greenkeeper.io/perliedman/elevation-service.svg)](https://greenkeeper.io/)

Elevation data for your GeoJSON as a micro service. Yes, really!

You can try it out in [the elevation-service demo app](http://www.liedman.net/elevation-service/).

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
