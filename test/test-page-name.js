
var haiku = require('../')
  , pagify = require('../pagify')
  , path = require('path')
  , assert = require('assert')

describe('page.name', function(){
  var page

  before(function(){
    var src = path.resolve(__dirname, '../fixtures/template-data')
      , filename = path.join(src, 'content/posts/001.md')

    page = pagify(filename, haiku(src))
  })

  it('returns the filename relative to the --content-dir', function(){
    assert.equal(page.name, 'posts/001.md')
  })
})
