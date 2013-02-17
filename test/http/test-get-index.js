
var haiku = require('../../lib')
  , assert = require('assert')
  , server = require('../support/server')
  , request = require('supertest')

describe('GET /', function(){
  it('returns 200 ok')

  it('has compiled content')

  /*

  * 200
  * content-type
  * proper conpiled content
  * gzip
  * deflate

  */

  describe('cache requests', function(){
    describe('against changed entities', function(){
      it('returns 200 ok')
      it('has a new etag')
      it('returns new content')

      /*

      * etag
      * last-modified
      * 304
      * no body

      */

    })
  })
})
