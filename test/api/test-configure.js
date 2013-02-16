
var haiku = require('../../lib')
  , assert = require('assert')
  , path = require('path')

describe('haiku.configure(options)', function(){
  beforeEach(function(){
    haiku.configure(haiku.defaults)
  })

  it('sets haiku.root', function(){
    haiku.configure({ root: '../' })

    assert.equal(haiku.root, path.resolve(process.cwd(), '../'))
  })
})
