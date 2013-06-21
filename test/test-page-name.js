
var haiku = require('../')
  , path = require('path')
  , assert = require('assert')

describe('page.name', function(){
  var src = path.resolve(__dirname, './fixtures/template-data')
    , page

  before(function(done){
    haiku(src)
    .find('posts/001.md', function(err, _page){
      page = _page
      done(err)
    })
  })

  it('returns the filename relative to the --content-dir', function(){
    assert.equal(page.name, 'posts/001.md')
  })
})
