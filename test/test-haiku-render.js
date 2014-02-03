
const haiku = require('../')
    , assert = require('assert')
    , resolve = require('./resolve')
    , src = resolve('src')
    , cheerio = require('cheerio')

describe('h.render(key, context, callback)', function(){
  it('binds callback to page instance', function(done){
    var Page = require('../lib/page').ctor

    haiku(src)
    .render('/basic-page.html', function(err, output){
      if (err) return done(err)
      assert.ok(this instanceof Page)
      done()
    })
  })

  it('renders the page.content template', function(done){
    haiku(src)
    .render('/basic-page.html', function(err, output){
      if (err) return done(err)

      var $ = cheerio.load(output)
        , text = $('p:first-of-type').text()
        , layout = $('body').attr('data-layout')

      assert.ok(output)
      assert.equal(text, 'Just a page.')
      assert.equal(layout, 'default')

      done()
    })
  })

  it('renders with page context', function(done){
    haiku(src)
    .render('/basic-page.html', function(err, output){
      if (err) return done(err)

      var page = this
        , $ = cheerio.load(output)

      assert.equal($('.url').text(), page.url)
      assert.equal($('.content-type').text(), page.mime)
      assert.equal($('title').text(), page.title + ' // haiku')
      assert.equal($('.draft').text(), page.draft.toString())
      assert.equal($('.foo').text(), page.meta.foo)

      done()
    })
  })

  it('renders with haiku context', function(done){
    haiku(src)
    .render('/content-lists.html', function(err, output){
      if (err) return done(err)

      var $ = cheerio.load(output)

      assert.equal($('.content-list li').length, 3)
      assert.equal($('.posts-list li').length, 5)

      done()
    })
  })

  it('passes context into the template', function(done){
    var context = { foo: 'sentence'
        , bar: 'non-standard'
        , page: {}
        , content: []
        }

    haiku(src)
    .render('/manual-context.html', context, function(err, output){
      if (err) return done(err)

      var page = this
        , $ = cheerio.load(output)
        , pageCount = $('.content-list li').length
        , title = $('.page-title').text()

      // random vars
      assert.equal($('.foo').text(), context.foo)
      assert.equal($('.bar').text(), context.bar)

      // don't squash haiku's template variable API
      assert.equal(title, page.title, 'Bad template variable: page.title')
      assert.ok(pageCount > 0, 'Bad template variable: content')

      done()
    })
  })

  it('applies the default layout to html')
  it('does not apply the default layout to non-html')
  it('allows layout override')
  it('renders with arbitrary templates/partials')
})
