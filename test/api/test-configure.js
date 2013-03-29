
var haiku = require('../../')
  , assert = require('assert')
  , path = require('path')

describe('h.configure(options)', function(){
  var h

  before(function(){
    h = haiku().configure({ src: '../' })
  })

  it('sets h.options.src', function(){
    assert.equal(h.options.src, path.resolve(process.cwd(), '../'))
  })

  it('sets h.options["log-level"]')
})
