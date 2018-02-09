#!/bin/sh

mkdir -p assets
cp -a node_modules/leaflet/dist/* assets/

npx browserify index.js -o site.js
