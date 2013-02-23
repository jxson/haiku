
var haiku = require('../../lib')
  , assert = require('assert')
  , app = require('../support/server')
  , request = require('supertest')

describe('GET 404 not found', function(){
  var server

  before(function(done){
    server = app.listen(1337, done)
  })

  it('returns 404 not found', function(done){
    request(server)
    .get('/should-404')
    .expect(404)
    .end(done)
  })

  it('returns a meaningful body', function(done){
    request(server)
    .get('/should-404')
    .expect('content-type', 'text/plain')
    .expect(404, function(err, res){
      if (err) return done(err)

      assert.ok(res.text.length)

      done()
    })
  })
})

describe('GET 406 not acceptable', function(){
  it('returns 406 not not acceptable')
  it('returns a meaningful body')
})
