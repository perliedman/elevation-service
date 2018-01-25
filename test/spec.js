const micro = require('micro')
const test = require('ava')
const listen = require('test-listen')
const request = require('request-promise-native')
var app = require('../')

test('should add elevation data for point', async t => {
  const service = micro(app)
  const uri = await listen(service)
  const body = await request({
    uri,
    method: 'POST',
    body: {
      type: 'Point',
      coordinates: [11.9, 57.7]
    },
    json: true
  })

  t.is(body.type, 'Point')
  t.truthy(body.coordinates)
  t.is(body.coordinates.length, 3)
  t.true(Math.abs(body.coordinates[2] - 13) < 1e-3)

  service.close()
});
