
var haiku = require('../../lib')
  , assert = require('assert')
  , server = require('../support/server')
  , request = require('supertest')

describe('GET /', function(){
  it('returns 200 ok', function(done){
    request(server)
    .get('/')
    .expect(200)
    .end(done)
  })

  it('has compiled content')

  /*

  * 200
  * content-type
  * proper conpiled content
  * gzip
  * deflate

  */
})
