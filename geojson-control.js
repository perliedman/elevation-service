var L = require('leaflet'),
    geojsonhint = require('geojsonhint');

module.exports = L.Control.extend({
    includes: L.Mixin.Events,

    onAdd: function() {
        var container = L.DomUtil.create('div', 'geojson-control leaflet-bar'),
            input = L.DomUtil.create('textarea', '', container),
            submitBtn = L.DomUtil.create('button', '', container),
            errorList = L.DomUtil.create('ul', '', container);

        L.DomEvent.disableClickPropagation(container);

        submitBtn.type = 'button';
        submitBtn.innerHTML = 'Submit';
        L.DomEvent.on(submitBtn, 'click', function() {
            if (this._validate(input.value)) {
                this.fire('submitgeojson', { geojson: JSON.parse(input.value) });
            }
        }, this);

        this._input = input;
        this._errorList = errorList;
        return this._container = container;
    },

    setData: function(geojson) {
        this._input.value = JSON.stringify(geojson, null, '  ');
    },

    getContainer: function() {
        return this._container;
    },

    _validate: function(s) {
        var errors = geojsonhint.hint(s);
        if (errors && errors.length) {
            this._errorList.innerHTML = errors
                .map(function(e) {
                    return '<li><em>Line ' + e.line + '</em>: ' + e.message;
                })
                .join('\n');

            return false;
        }

        this._errorList.innerHTML = '';
        return true;
    }
});
