#!/bin/sh

./build.sh

watchify index.js -o site.js &

http-server

