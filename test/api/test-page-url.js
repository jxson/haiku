
var haiku = require('../../lib')
  , assert = require('assert')
  , path = require('path')

describe('page.url', function(){
  var page =

  before(function(done){
    var root = path.resolve(__dirname, '../fixtures/blog')

    haiku.reset()
    haiku.configure({ root: root })

    haiku.read('foo.md', function(err, _page){
      if (err) return done(err)

      page = _page

      done()
    })
  })

  it('returns an absolute url', function(){
    assert.equal(page.url, '/foo.html')
  })
})
