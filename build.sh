#!/bin/sh

mkdir assets
cp -a node_modules/leaflet/dist/* assets/

browserify index.js -o site.js
