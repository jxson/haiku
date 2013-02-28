
var pagify = require('../../lib/pagify')
  , assert = require('assert')
  , path = require('path')

describe('page.read(callback)', function(){
  var _path = path.resolve(__dirname, '../fixtures/blog/content/foo.md')
    , page = pagify({ path: _path })

  it('reads the page', function(done){
    page.read(function(err){
      if (err) return done(err)

      assert.ok(page.stats)
      assert.ok(page.data)

      done()
    })
  })

  it('emits a `read` event')

  describe('errors', function(){
    it('handles fs.stat errors')
    it('handles fs.readFile errors')
  })
})
