
var haiku = require('../../lib')
  , http = require('http')
  , assert = require('assert')
  , path = require('path')
  , server = require('../support/server')
  , request = require('supertest')

describe('GET 404 not found', function(){
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
  it('returns 406 not found')
  it('has content-length')
})
