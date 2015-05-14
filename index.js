var addElevation = require('geojson-elevation').addElevation,
    TileSet = require('node-hgt').TileSet,
    ImagicoElevationDownloader = require('node-hgt').ImagicoElevationDownloader,
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    tiles,
    tileDownloader,
    tileDirectory = process.env.TILE_DIRECTORY;

if(!tileDirectory) {
    tileDirectory = "./data";
}

if(process.env.TILE_DOWNLOADER) {
    if(process.env.TILE_DOWNLOADER == "imagico") {
        tileDownloader = new ImagicoElevationDownloader();
    }
}

tiles = new TileSet(tileDirectory, {downloader:tileDownloader});

app.use(bodyParser.json());
app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.contentType('application/json');
    next();
});
app.post('/geojson', function(req, res) {
    var geojson = req.body;

    if (!geojson || Object.keys(geojson).length === 0) {
        res.status(400).send('Error: invalid geojson.');
        return;
    }

    addElevation(geojson, tiles, function(err) {
        if (err) {
            res.status(500).send(err);
        } else {
            res.send(JSON.stringify(geojson));
        }
    });
});

var server = app.listen(5001, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('elevation-server listening at http://%s:%s', host, port);
});