
const test = require('tape')
const read = require('../lib/read')
const assert = require('assert')
const resolve = require('./resolve')
const basedir = resolve('content')

test('page.slug', function(assert) {
  var filename = resolve('content/basic-page.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.slug, 'basic-page')
    assert.end()
  })
})

test('page.slug - nested', function(assert) {
  var filename = resolve('content/posts/001.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.slug, 'posts/001')
    assert.end()
  })
})
