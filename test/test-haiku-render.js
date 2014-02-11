
const haiku = require('../')
    , assert = require('assert')
    , resolve = require('./resolve')
    , src = resolve('src')
    , fs = require('graceful-fs')
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
    var h = haiku(src)
    .render('/content-lists.html', function(err, output){
      if (err) return done(err)

      var $ = cheerio.load(output)
        , contents = h.context.content.map(map)
        , posts = h.context.content.posts.map(map)

      $('.content-list li').each(function(index, element){
        var title = $(this).text().trim()

        assert.ok(contents.indexOf(title) >= 0, 'Missing page "' + title + '"')
      })


      $('.posts-list li').each(function(index, element){
        var title = $(this).text().trim()

        assert.ok(posts.indexOf(title) >= 0, 'Missing page "' + title + '"')
      })

      done()
    })

    function map(page){
      return page.title
    }
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

  it('applies the default layout to html', function(done){
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

  it('does not apply the default layout to non-html', function(done){
    haiku(src)
    .render('/atom.xml', function(err, output){
      if (err) return done(err)

      var message = 'Default layout applied to non-html'

      assert.ok(! output.match('<!DOCTYPE html>'), message)
      assert.ok(! output.match('<body data-layout="default">'), message)

      done()
    })
  })

  it('allows layout override via front matter', function(done){
    haiku(src)
    .render('/layout-override.html', function(err, output){
      if (err) return done(err)

      var page = this
        , $ = cheerio.load(output)
        , layout = $('body').attr('data-layout')
        , expected = page.meta.layout

      assert.equal(layout, expected)

      done()
    })
  })


  it('allows layout override via context', function(done){
    var context = { layout: 'custom' }

    haiku(src)
    .render('/layout-override.html', context,  function(err, output){
      if (err) return done(err)

      var page = this
        , $ = cheerio.load(output)
        , layout = $('body').attr('data-layout')

      assert.equal(layout, 'custom')

      done()
    })
  })

  it('renders with arbitrary templates/partials', function(done){
    haiku(src)
    .render('/page-with-partials.html',  function(err, output){
      if (err) return done(err)

      var $ = cheerio.load(output)

      assert.ok($('.comments').length, 'Missing partial: shared/comments')

      done()
    })
  })

  it('does not compile raw markdown', function(done){
    haiku(src)
    .render('/raw-markdown.md', function(err, output){
      if (err) return done(err)

      var page = this

      assert.ok(output.match(page.title), 'Missing page.title')
      assert.equal(output.match('<p>'), null)

      done()
    })
  })
})
