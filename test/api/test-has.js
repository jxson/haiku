
var haiku = require('../../lib')
  , assert = require('assert')

describe('haiku.has(url)', function(){
  it('returns false if there is no content for `url`', function(){
    assert.equal(haiku.has('/should-return-false'), false)
  })

  it('returns true if haiku has content for `url`')
})
