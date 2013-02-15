
var haiku = require('../../lib')
  , assert = require('assert')
  , path = require('path')
  , blog = path.join(__dirname, '..', 'fixtures', 'blog')

describe('haiku', function(){
  it('exists', function(){
    assert.ok(haiku)
  })

  it('exports haiku.handler()', function(){
    assert.equal(typeof haiku.handler, 'function')
  })
})
