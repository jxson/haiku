var haiku = require('../')
  , path = require('path')
  , assert = require('assert')

describe('page.context', function(){
  var src = path.resolve(__dirname, './fixtures/page-context')
    , h

  before(function(done){
    h = haiku(src)
    .on('error', done)
    .on('end', done)
  })

  it('allows arbitrary values via front-matter', function(done){
    h.find('arbitrary.md', function(err, page){
      if (err) return done(err)
      assert.equal(page.context.foo, 'oh')
      assert.equal(page.context.bar, 'my')
      assert.equal(page.context.baz, 'glob')
      done()
    })
  })

  it('allows the expansion of pages via front-matter', function(done){
    h.find('page-expansion.md', function(err, page){
      if (err) return done(err)

      assert.equal(typeof page.context.expanded, 'function')

      var expanded = page.context.expanded()

      assert.equal(expanded.foo, 'oh')
      assert.equal(expanded.bar, 'my')
      assert.equal(expanded.baz, 'glob')

      done()
    })
  })

  describe('.title', function(){
    it('defaults to page.name', function(done){
      h.find('defaults.md', function(err, page){
        if (err) return done(err)
        assert.equal(page.context.title, page.name)
        done()
      })
    })

    it('can be overridden by front-matter', function(done){
      h.find('override.md', function(err, page){
        if (err) return done(err)
        assert.equal(page.context.title
        , 'whatevs, this is the real title.')
        done()
      })
    })
  })

  // NOTE: I don't think this is useful, leaving in case I change my mind
  // describe('.body', function(){
  //   it('is the un-rendered content of the page', function(done){
  //     h.find('defaults.md', function(err, page){
  //       if (err) return done(err)
  //       assert.equal(page.context.body.trim(), 'No front-matter here')
  //       done()
  //     })
  //   })

  //   it('can NOT be overridden by front-matter', function(){
  //     var page = h.find('override.md')

  //     assert.equal(page.context.body.trim(), 'You can\'t override me')
  //   })
  // })

  describe('.date', function(){
    it('defaults to undefined', function(done){
      h.find('defaults.md', function(err, page){
        if (err) return done(err)
        assert.equal(page.context.date, undefined)
        done()
      })
    })

    it('can be overridden by front-matter', function(done){
      h.find('override.md', function(err, page){
        if (err) return done(err)

        var date = page.context.date

        assert.ok(date instanceof Date, 'Bad page.context.date')
        assert.equal(page.context.date.getTime()
        , page.meta.date.getTime())

        done()
      })
    })
  })

  describe('.url', function(){
    it('is the url for the built page', function(done){
      h.find('defaults.md', function(err, page){
        if (err) return done(err)
        assert.ok(page.context.url, '/defaults.html')
        done()
      })
    })

    it('can NOT be overridden by front-matter', function(done){
      h.find('override.md', function(err, page){
        if (err) return done(err)
        assert.ok(page.context.url, '/override.html')
        done()
      })
    })
  })

  describe('lambdas/helpers', function(){
    describe('.next', function(){
      it('provides the next page in page.dirname', function(done){
        var names = [ 'linked-pages/second.md'
            , 'linked-pages/third.md'
            ]

        h.find(names, function(err, pages){
          if (err) return done(err)

          var current = pages['linked-pages/second.md']
            , expected = pages['linked-pages/third.md']
            , actual = current.context.next()

          assert.equal(actual.url, expected.url)

          done()
        })
      })
    })

    describe('.previous', function(){
      it('provides the previous page in page.dirname', function(done){
        var names = [ 'linked-pages/second.md'
            , 'linked-pages/first.md'
            ]

        h.find(names, function(err, pages){
          if (err) return done(err)

          var current = pages['linked-pages/second.md']
            , expected = pages['linked-pages/first.md']
            , actual = current.context.previous()

          assert.equal(actual.url, expected.url)

          done()
        })
      })
    })
  })
})
