
var haiku = require('../../lib')
  , assert = require('assert')
  , path = require('path')

describe('haiku.has(url)', function(){
  before(function(done){
    var root = path.resolve(__dirname, '../fixtures/blog')

    haiku.reset()
    haiku.configure({ root: root })

    haiku.read(done)
  })

  it('returns false if there is no content for `url`', function(){
    assert.equal(haiku.has('/should-return-false'), false)
  })

  it('returns true if haiku has content for `url`', function(){
    assert.ok(haiku.has('/foo.html'))
  })
})
