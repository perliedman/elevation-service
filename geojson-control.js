var L = require('leaflet');

module.exports = L.Control.extend({
    includes: L.Mixin.Events,

    onAdd: function() {
        var container = L.DomUtil.create('div', 'geojson-control leaflet-bar'),
            input = L.DomUtil.create('textarea', '', container),
            submitBtn = L.DomUtil.create('button', '', container);

        L.DomEvent.disableClickPropagation(container);

        submitBtn.type = 'button';
        submitBtn.innerHTML = 'Submit';
        L.DomEvent.on(submitBtn, 'click', function(e) {
            this.fire('submitgeojson', { geojson: JSON.parse(input.value) });
        }, this);

        this._input = input;
        return this._container = container;
    },

    setData: function(geojson) {
        this._input.value = JSON.stringify(geojson, null, '  ');
    },

    getContainer: function() {
        return this._container;
    }
});
