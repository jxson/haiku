
var haiku = require('../')
  , assert = require('assert')
  , path = require('path')

describe('h.context', function(){
  var h
    , src = path.resolve(__dirname, './fixtures/template-data')

  before(function(done){
    h = haiku(src).end(done)
  })

  it('populates after `read`', function(){
    var ctx = haiku(src).context

    assert.equal(Object.keys(ctx).length, 1)
    assert.ok(Object.keys(h.context.content).length > 0)
  })

  xit('has properties for every page', function(){
    assert.ok(h.context['haiku:about.md'])
    assert.ok(h.context['haiku:contact.md'])
    assert.ok(h.context['haiku:index.md'])
    assert.ok(h.context['haiku:posts/index.md'])
    assert.ok(h.context['haiku:posts/001.md'])
    assert.ok(h.context['haiku:posts/002.md'])
    assert.ok(h.context['haiku:posts/003.md'])
  })

  describe('content collection', function(){
    it('contains pages in the --content-dir', function(){
      assert.ok(h.context.content.length)

      h.context.content.forEach(function(page){
        assert.equal(typeof page, 'object')
      })
    })

    it('does not include index pages', function(){
      assert.equal(h.context.content.length, 4)

      h.context.content.forEach(function(page){
        assert.ok(! page.url.match(/^index/))
      })
    })

    describe('sub directories', function(){
      it('contains pages in the sub directory', function(){
        assert.equal(h.context.content.posts.length, 3)

        h.context.content.posts.forEach(function(page){
          assert.equal(typeof page, 'object')
        })
      })

      it('does not include index pages', function(){
        assert.equal(h.context.content.posts.length, 3)

        h.context.content.posts.forEach(function(page){
          assert.ok(! page.url.match(/^index/))
        })
      })
    })
  })

  describe('sorting', function(){
    var byDate
      , byName

    before(function(done){
      haiku(path.resolve(__dirname, './fixtures/sortable'))
      .on('end', function(){
        byDate = this.context.content['sort-by-date']
        byName = this.context.content['sort-by-name']
      }).end(done)
    })

    it('sorts descending by date', function(){
      var first = byDate[0]
        , last = byDate[byDate.length - 1]

      assert.equal(first.title, 'First')
      assert.equal(last.title, 'Third')
    })

    it('sorts by name', function(){
      var first = byName[0]
        , last = byName[byDate.length - 1]

      assert.equal(first.title, 'First')
      assert.equal(last.title, 'Third')
    })
  })
})
