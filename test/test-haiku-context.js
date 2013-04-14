
var haiku = require('../')
  , assert = require('assert')
  , path = require('path')

describe('h.context', function(){
  var h
    , src = path.resolve(__dirname, './fixtures/blog')

  before(function(done){
    h = haiku(src)
        .read(done)
  })

  it('populates after `read`', function(){
    assert.equal(Object.keys(haiku(src).context).length, 0)
    assert.ok(Object.keys(h.context).length > 0)
  })

  it('has properties for every page', function(){
    assert.ok(h.context['about.md'])
    assert.ok(h.context['contact.md'])
    assert.ok(h.context['index.md'])
    assert.ok(h.context['posts/index.md'])
    assert.ok(h.context['posts/001.md'])
    assert.ok(h.context['posts/002.md'])
    assert.ok(h.context['posts/003.md'])
  })

  describe('content collection', function(){
    it('contains pages in the --content-dir', function(){
      assert.ok(h.context.content.length)

      h.context.content.forEach(function(page){
        assert.equal(typeof page, 'object')
      })
    })

    it('does not include index pages', function(){
      assert.equal(h.context.content.length, 2)

      h.context.content.forEach(function(page){
        assert.ok(! page.url.match(/^index/))
      })
    })

    describe('sub directories', function(){
      it('contains pages in the sub directory')
      it('does not include index pages')
    })

    describe('sorting', function(){
      it('sorts by date')
      it('sorts by name')
    })
  })
})
