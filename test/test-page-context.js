var haiku = require('../')
  , pagify = require('../pagify')
  , path = require('path')
  , assert = require('assert')

describe('page.context', function(){
  var src = path.resolve(__dirname, './fixtures/page-context')
    , h

  before(function(done){
    h = haiku(src).read(done)
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

      assert.ok(page.context.date instanceof Date
      , 'Bad page.context.date')
    })

    it('can be overridden by front-matter', function(){
      var page = h.find('override.md')

      assert.ok(page.context.date instanceof Date
      , 'Bad page.context.date')
      assert.equal(page.context.date.getTime()
      , page.meta.date.getTime())
    })
  })

  describe('.id', function(){
    it('is a unique identifier based on page.name')

    it('can be overridden by front-matter')
  })

  describe('.url', function(){
    it('is the url for the built page')

    it('can NOT be overridden by front-matter')
  })

  describe('.next', function(){
    it('is the next page in page.dirname')
  })

  describe('.previous', function(){
    it('is the previous page in page.dirname')
  })
})

xdescribe('', function(){
  it('allows  to be defined via front-matter')

  it('provides helpers for expanding page sections')
})

function find(name){

}
