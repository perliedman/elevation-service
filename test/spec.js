var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();
var app = require('../');

chai.use(chaiHttp);

describe('routes', function() {
    describe('POST /geojson', function() {
        it('should add elevation data for point', function(done) {
            chai
                .request(app)
                .post('/geojson')
                .send({
                    type: 'Point',
                    coordinates: [11.9, 57.7]
                })
                .end(function(err, res) {
                    should.not.exist(err);
                    res.status.should.equal(200);
                    res.type.should.equal('application/json');
                    should.exist(res.body.coordinates);
                    res.body.coordinates.length.should.equal(3);
                    done();
                });
        });
    });
});
