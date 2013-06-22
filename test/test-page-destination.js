
var haiku = require('../')
  , path = require('path')
  , assert = require('assert')

describe('page.destination', function(){
  var post
    , src = path.resolve(__dirname, './fixtures/template-data')

  before(function(done){
    haiku(src)
    .find('posts/001.md', function(err, page){
      post = page
      done(err)
    })
  })

  it('returns the absolute destination/ buildpath', function(){
    var expected = path.join(src, 'build', 'posts', '001.html')

    assert.equal(post.destination, expected)
  })
})
