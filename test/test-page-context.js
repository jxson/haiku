var haiku = require('../')
  , pagify = require('../pagify')
  , path = require('path')
  , assert = require('assert')

describe('page.context', function(){
  var src = path.resolve(__dirname, './fixtures/page-context')
    , h

  before(function(done){
    h = haiku(src).end(done)
  })

  it('allows arbitrary values via front-matter', function(){
    var page = h.find('arbitrary.md')

    assert.equal(page.context.foo, 'oh')
    assert.equal(page.context.bar, 'my')
    assert.equal(page.context.baz, 'glob')
  })

  it('allows the expansion of pages via front-matter', function(){
    var page = h.find('page-expansion.md')

    assert.equal(page.context.expanded.foo, 'oh')
    assert.equal(page.context.expanded.bar, 'my')
    assert.equal(page.context.expanded.baz, 'glob')
  })

  describe('.title', function(){
    it('defaults to page.name', function(){
      var page = h.find('defaults.md')

      assert.equal(page.context.title, page.name)
    })

    it('can be overridden by front-matter', function(){
      var page = h.find('override.md')

      assert.equal(page.context.title
      , 'whatevs, this is the real title.')
    })
  })

  describe('.body', function(){
    it('is the un-rendered content of the page', function(){
      var page = h.find('defaults.md')

      assert.equal(page.context.body.trim(), 'No front-matter here')
    })

    it('can NOT be overridden by front-matter', function(){
      var page = h.find('override.md')

      assert.equal(page.context.body.trim(), 'You can\'t override me')
    })
  })

  describe('.date', function(){
    it('defaults to undefined', function(){
      var page = h.find('defaults.md')

      assert.equal(page.context.date, undefined)
    })

    it('can be overridden by front-matter', function(){
      var page = h.find('override.md')

      assert.ok(page.context.date instanceof Date
      , 'Bad page.context.date')
      assert.equal(page.context.date.getTime()
      , page.meta.date.getTime())
    })
  })

  describe('.url', function(){
    it('is the url for the built page', function(){
      var page = h.find('defaults.md')

      assert.ok(page.context.url, '/defaults.html')
    })

    it('can NOT be overridden by front-matter', function(){
      var page = h.find('override.md')

      assert.ok(page.context.url, '/override.html')
    })
  })

  describe('lambdas/helpers', function(){
    describe('.next', function(){
      it('provides the next page in page.dirname', function(){
        var current = h.find('linked-pages/second.md')
          , expected = h.find('linked-pages/third.md')
          , actual = current.context.next()

        assert.equal(actual.url, expected.url)
      })
    })

    describe('.previous', function(){
      it('provides the previous page in page.dirname', function(){
        var current = h.find('linked-pages/second.md')
          , expected = h.find('linked-pages/first.md')
          , actual = current.context.previous()

        assert.equal(actual.url, expected.url)
      })
    })
  })
})
