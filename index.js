var addElevation = require('geojson-elevation').addElevation,
    TileSet = require('node-hgt').TileSet,
    ImagicoElevationDownloader = require('node-hgt').ImagicoElevationDownloader,
    express = require('express'),
    bodyParser = require('body-parser'),
    app = express(),
    tileDirectory = process.env.TILE_DIRECTORY,
    tiles,
    tileDownloader,
    noData;

if (!tileDirectory) {
    tileDirectory = './data';
}

if (!process.env.TILE_DOWNLOADER || process.env.TILE_DOWNLOADER === 'imagico') {
    tileDownloader = new ImagicoElevationDownloader(tileDirectory);
} else if(process.env.TILE_DOWNLOADER === 'none') {
    tileDownloader = undefined;
}

if (process.env.NO_DATA) {
    noData = parseInt(process.env.NO_DATA);
}

tiles = new TileSet(tileDirectory, {downloader:tileDownloader});

var maxPostSize = "500kb";
if (process.env.MAX_POST_SIZE) {
    maxPostSize = process.env.MAX_POST_SIZE;
}

app.use(bodyParser.json({limit: maxPostSize}));
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
            var errMsg = JSON.stringify(err);
            process.stderr.write(errMsg + '\n');
            res.status(500).send(errMsg);
        } else {
            res.send(JSON.stringify(geojson));
        }
    }, noData);
});

app.get('/status', function(req, res) {
    res.send();
});

var server = app.listen(5001, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('elevation-server listening at http://%s:%s', host, port);
});
