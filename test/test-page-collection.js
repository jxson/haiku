
var haiku = require('../')
  , pagify = require('../pagify')
  , path = require('path')
  , assert = require('assert')

describe('page.collection', function(){
  var page
    , src = path.resolve(__dirname, '../fixtures/template-data')
    , filename = path.join(src, 'content/posts/001.md')

  before(function(){
    page = pagify(filename, haiku(src))
  })

  it('returns the --src relative dirname as a selector', function(){
    assert.equal(page.collection, 'content.posts')
  })
})
