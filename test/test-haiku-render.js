
const test = require('tape')
const haiku = require('../')
const source = require('./resolve')('source')
const Page = require('../lib/page')
const cheerio = require('cheerio')

test('h.render(key, callback)', function(t) {
  haiku(source)
  .render('/basic-page.html', function(err, output) {
    t.error(err, 'should not error')
    t.ok(this instanceof Page, 'callback should be bound to page')
    t.ok(output, 'should have output')

    var page = this
    var $ = cheerio.load(output)
    var layout = $('body').attr('data-layout')

    t.equal(layout, 'default')
    t.equal($('title').text(), page.title)
    t.equal($('.title').text(), page.title)
    t.equal($('.url').text(), page.url)
    t.equal($('.content-type').text(), page['content-type'])
    t.equal($('.last-modified').text(), page['last-modified'])
    t.equal($('.etag').text(), page.etag)
    t.equal($('.draft').text(), 'false')
    t.equal($('.enumerable').text(), 'true')
    t.equal($('.foo').text(), page.meta.foo)

    t.end()
  })
})

test('h.render(key, callback) - content-type override', function(t) {
  haiku(source)
  .render('/raw-markdown.md', function(err, output) {
    t.error(err, 'should not error')

    var page = this
    var $ = cheerio.load(output)

    t.equal(page['content-type'], 'text/x-markdown')
    t.notOk($('p').length, 'should not compile MD')
    t.end()
  })
})

test('h.render(key, context, callback)', function(t) {
  var context = { baz: 'qux' }

  haiku(source)
  .render('/basic-page.html', context, function(err, output) {
    t.error(err, 'should not error')

    var page = this
    var $ = cheerio.load(output)

    t.equal($('.baz').text(), context.baz)
    t.end()
  })
})

test('h.render(key, context, callback) - layout: via context', function(t) {
  var context = { layout: 'custom' }

  haiku(source)
  .render('/basic-page.html', context, function(err, output) {
    t.error(err, 'should not error')

    var page = this
    var $ = cheerio.load(output)
    var layout = $('body').attr('data-layout')

    t.equal(layout, 'custom')
    t.end()
  })
})

test('h.render(key, callback) - layout: via front-matter', function(t) {
  haiku(source)
  .render('/overrides.html', function(err, output) {
    t.error(err, 'should not error')

    var page = this
    var $ = cheerio.load(output)
    var layout = $('body').attr('data-layout')

    t.equal(layout, 'custom')
    t.end()
  })
})

/*

partials:

* renders with arbitrary templates/partials
* partials from templates
* partials from pages

*/
