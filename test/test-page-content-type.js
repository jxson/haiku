
const test = require('tape')
const read = require('../lib/read')
const assert = require('assert')
const resolve = require('./resolve')
const basedir = resolve('content')

test('page["content-type"] - markdown', function(assert) {
  var filename = resolve('content/basic-page.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page['content-type'], 'text/html')
    assert.end()
  })
})

test('page["content-type"] - markdown with override', function(assert) {
  var filename = resolve('content/raw-markdown.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page['content-type'], 'text/x-markdown')
    assert.end()
  })
})

test('page["content-type"] - non-markdown', function(assert) {
  var filename = resolve('content/atom.xml')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page['content-type'], 'application/xml')
    assert.end()
  })
})

test('page["content-type"] - non-markdown with override', function(assert) {
  var filename = resolve('content/jxson.gpg')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page['content-type'], 'plain/text')
    assert.end()
  })
})
