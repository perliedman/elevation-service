var L = require('leaflet'),
    point = require('turf-point'),
    feature = require('turf-feature'),
    reqwest = require('reqwest'),
    GeoJsonControl = require('./geojson-control'),
    ElevationWidget = require('./elevation'),
    map = L.map('map').setView([57.7, 11.9], 10),
    geoJsonControl = new GeoJsonControl({position: 'topright'}).addTo(map),
    elevationWidget = new ElevationWidget(),
    dataLayer = L.geoJson().addTo(map),
    fetchElevationData = function(geojson) {
        var data = (geojson.type === 'Feature' || geojson.type === 'FeatureCollection') ? geojson : feature(geojson),
            dataBounds;

        dataLayer.clearLayers();
        dataLayer.addData(data);
        dataBounds = dataLayer.getBounds();

        if (!map.getBounds().contains(dataBounds)) {
            map.fitBounds(dataBounds);
        }

        throbber.style.display = 'block';

        reqwest({
                url: 'https://data.cykelbanor.se/elevation/geojson',
                method: 'POST',
                type: 'json',
                contentType: 'application/json',
                data: JSON.stringify(data)
            })
            .then(function(response) {
                elevationWidget.clear();
                elevationWidget.addData(response.geometry);
                throbber.style.display = 'none';
            })
            .catch(function(err) {
                var errObj;

                // TODO: show error message
                throbber.style.display = 'none';
                elevationWidget.clear();

                errObj = JSON.parse(err.response);
                if (errObj.code === 'ENOENT') {
                    geoJsonControl.setError('Missing elevation data.');
                } else {
                    geoJsonControl.setError('Unknown error (' + errObj.code + ').');
                }
            });
    },
    throbber = L.DomUtil.create('img', 'throbber');

L.Icon.Default.imagePath = 'assets/images';

throbber.src = 'assets/throbber.gif';
geoJsonControl.getContainer().appendChild(throbber);

geoJsonControl.getContainer().appendChild(elevationWidget.onAdd());

L.DomEvent.on(L.DomUtil.get('bannerWrapper'), 'click', function() {
    L.DomUtil.get('bannerWrapper').style.display = 'none';
});

L.tileLayer('https://api.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibGllZG1hbiIsImEiOiIzNzkzMWI4ZWI3Mjk2YThlNzQwMzllODdiYzY0ZTBhOSJ9.LvDo_NWlxJ_6FE1w-dmOPQ')
    .addTo(map);

geoJsonControl.on('submitgeojson', function(e) {
    fetchElevationData(e.geojson);
});

map.on('click', function(e) {
    var ll = e.latlng,
        p = point([ll.lng, ll.lat]);

    geoJsonControl.setData(p);
    fetchElevationData(p);
});
