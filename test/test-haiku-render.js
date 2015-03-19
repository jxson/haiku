
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
    t.notOk(output.match('<!DOCTYPE html>'))
    t.notOk(output.match('<body data-layout="default">'))
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

test.only('h.render(key, callback) - partials', function(t) {
  haiku(source)
  .render('/posts/001.html', function(err, output) {
    t.error(err, 'should not error')

    var page = this
    var $ = cheerio.load(output)

    t.equal($('header').length, 1)
    t.equal($('footer').length, 1)
    t.equal($('.comments').length, 1)
    t.end()
  })
})


//
// it('renders with haiku context', function(done){
//   var h = haiku(src)
//   .render('/content-lists.html', function(err, output){
//     if (err) return done(err)
//
//     var $ = cheerio.load(output)
//       , contents = h.context.content.map(map)
//       , posts = h.context.content.posts.map(map)
//
//     $('.content-list li').each(function(index, element){
//       var title = $(this).text().trim()
//
//       assert.ok(contents.indexOf(title) >= 0, 'Missing page "' + title + '"')
//     })
//
//
//     $('.posts-list li').each(function(index, element){
//       var title = $(this).text().trim()
//
//       assert.ok(posts.indexOf(title) >= 0, 'Missing page "' + title + '"')
//     })
//
//     done()
//   })
//
//   function map(page){
//     return page.title
//   }
// })
//
// it('passes context into the template', function(done){
//   var context = { foo: 'sentence'
//       , bar: 'non-standard'
//       , page: {}
//       , content: []
//       }
//
//   haiku(src)
//   .render('/manual-context.html', context, function(err, output){
//     if (err) return done(err)
//
//     var page = this
//       , $ = cheerio.load(output)
//       , pageCount = $('.content-list li').length
//       , title = $('.page-title').text()
//
//     // random vars
//     assert.equal($('.foo').text(), context.foo)
//     assert.equal($('.bar').text(), context.bar)
//
//     // don't squash haiku's template variable API
//     assert.equal(title, page.title, 'Bad template variable: page.title')
//     assert.ok(pageCount > 0, 'Bad template variable: content')
//
//     done()
//   })
// })
//
// it('renders with arbitrary templates/partials', function(done){
//   haiku(src)
//   .render('/page-with-partials.html',  function(err, output){
//     if (err) return done(err)
//
//     var $ = cheerio.load(output)
//
//     assert.ok($('.comments').length, 'Missing partial: shared/comments')
//
//     done()
//   })
// })
