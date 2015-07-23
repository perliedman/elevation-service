var L = require('leaflet'),
    d3 = require('d3');

module.exports = L.Class.extend({
    onAdd: function() {
        this._container = L.DomUtil.create('div', 'elevation-control');
        return this._container;
    },

    addData: function(geojson) {
        var margin = {top: 4, right: 10, bottom: 20, left: 24},
            width = 320 - margin.left - margin.right,
            height = 80 - margin.top - margin.bottom;

        var x = d3.scale.linear().range([0, width]);
        var y = d3.scale.linear().range([height, 0]);
         
        // Define the axes
        var xAxis = d3.svg.axis().scale(x)
            .orient('bottom').ticks(5);
         
        var yAxis = d3.svg.axis().scale(y)
            .orient('left').ticks(5);

        var valueline = d3.svg.line()
            .x(function(d) { return x(d.distance); })
            .y(function(d) { return y(d.elevation); });

        var svg = d3.select(this._container)
            .append('svg')
                .attr('width', width + margin.left + margin.right)
                .attr('height', height + margin.top + margin.bottom)
            .append('g')
                .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        var data,
            statsStr;

        switch (geojson.type) {
        case 'LineString':
            data = geojson.coordinates.reduce(function(a, c) {
                var ll = L.latLng([c[1], c[0], c[2]]),
                    elevDiff,
                    dist;

                if (a.lastLatLng) {
                    dist = a.lastLatLng.distanceTo(ll);
                    a.accDist += dist;
                    elevDiff = ll.alt - a.lastLatLng.alt;
                    if (elevDiff > 0) {
                        a.accClimb += elevDiff;
                    } else {
                        a.accDesc -= elevDiff;
                    }
                }

                a.data.push({
                    distance: a.accDist/1000,
                    elevation: c[2]
                });
                a.lastLatLng = ll;
                return a;
            }, {
                accDist: 0,
                accClimb: 0,
                accDesc: 0,
                data: []
            });
            statsStr = L.Util.template('&#9650;{climb} m, &#9660;{desc} m', {
                climb: Math.round(data.accClimb),
                desc: Math.round(data.accDesc),
            });
            break;
        case 'Point':
            data = {
                accDist: 0,
                accClimb: 0,
                accDesc: 0,
                data: [{
                    distance: 0,
                    elevation: geojson.coordinates[2]
                }]
            };
            statsStr = L.Util.template('Elevation: {elevation} m', {
                elevation: Math.round(data.data[0].elevation)
            });
            break;
        default:
            throw 'Unknown type "' + geojson.type + '".';
        }

        var statsElem = L.DomUtil.create('div', 'stats', this._container);
        statsElem.innerHTML = statsStr;

        // Scale the range of the data
        x.domain([0, d3.max(data.data, function(d) { return d.distance; })]);
        y.domain([0, Math.ceil(d3.max(data.data, function(d) { return d.elevation; }) / 50) * 50]);
     
        // Add the valueline path.
        svg.append('path')
            .attr('class', 'line')
            .attr('d', valueline(data.data));
     
        // Add the X Axis
        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis);
     
        // Add the Y Axis
        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis);
    },

    clear: function() {
        if (this._container) {
            this._container.innerHTML = '';
        }
    }
});
