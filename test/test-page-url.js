
const test = require('prova')
const read = require('../lib/read')
const assert = require('assert')
const resolve = require('./resolve')
const basedir = resolve('content')

test('page.url - converts .md to .html', function(assert) {
  var filename = resolve('content/basic-page.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.url, '/basic-page.html')
    assert.end()
  })
})

test('page.url - does NOT convert non-markdown', function(assert) {
  var filename = resolve('content/atom.xml')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.url, '/atom.xml')
    assert.end()
  })
})

test('page.url - content-type can override', function(assert) {
  var filename = resolve('content/raw-markdown.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.url, '/raw-markdown.md')
    assert.end()
  })
})
