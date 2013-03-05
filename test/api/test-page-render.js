
var haiku = require('../../lib')
  , pagify = require('../../lib/pagify')
  , assert = require('assert')
  , html = require('cheerio')

describe('page.render(context, callback)', function(){
  before(function(){
    haiku.configure({ root: 'test/fixtures/blog' })
  })

  it('compiles content', function(done){
    haiku.read('foo.md', function(err, page){
      if (err) return done(err)

      // console.log('this.haiku.root', haiku.root)
      // console.log('this.haiku["content-dir"]', haiku["content-dir"])

      page.render(function(err, content){
        if (err) return done(err)

        var $ = html.load(content)

        assert.ok(content)
        // check for layout
        assert.equal($('title').text(), 'Foo | just testing')
        // check for content
        assert.equal($('body').text().trim(), 'Nothing here but Foo')

        done()
      })
    })
  })

  it('handles extra context')

  it('includes partials')

  it('can iterate over content')
})
