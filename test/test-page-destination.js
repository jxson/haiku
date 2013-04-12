
var haiku = require('../')
  , pagify = require('../pagify')
  , path = require('path')
  , assert = require('assert')

describe('page.destination', function(){
  var page
    , src = path.resolve(__dirname, '../fixtures/template-data')
    , filename = path.join(src, 'content/posts/001.md')

  before(function(){
    page = pagify(filename, haiku(src))
  })

  it('returns the absolute destination/ buildpath', function(){
    var expected = path.join(src, 'build', 'posts', '001.html')

    assert.equal(page.destination, expected)
  })
})