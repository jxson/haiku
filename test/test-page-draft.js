
const test = require('tape')
const read = require('../lib/read')
const assert = require('assert')
const resolve = require('./resolve')
const basedir = resolve('content')
const source = resolve('source')
const haiku = require('../')

test('page.draft - defaults to false', function(assert) {
  var filename = resolve('content/defaults.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.draft, false)
    assert.end()
  })
})

test('page.draft - can be overridden', function(assert) {
  var filename = resolve('content/draft.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.draft, true)
    assert.end()
  })
})

test('page.draft - can be retrieved', function(assert) {
  haiku(source)
  .get('/draft.html', function(err, page) {
    assert.error(err)
    assert.equal(page.draft, true)
    assert.end()
  })
})

// TODO: Make sure drafts don't show up in the template variable collections
test.skip('page.draft - is not enumerable', function(assert) {
  haiku(source)
  .render('/index.html', function(err, html) {
    assert.error(err)

    var $ = cheerio.load(html)
    var draft = $('a[href="/draft.html"]')

    assert.ok(draft === false, 'draft pages should not be enumerable')
    assert.end()
  })
})
