
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

  it('renders with page context')
  it('renders with haiku context')
  it('passes context into the template')
  it('does not squash haiku context')
  it('applies the default layout to html')
  it('does not apply the default layout to non-html')
  it('allows layout override')
  it('renders with arbitrary templates/partials')
})