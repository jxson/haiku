
const test = require('tape')
const read = require('../lib/read')
const assert = require('assert')
const resolve = require('./resolve')
const basedir = resolve('content')

test('page.index - content-dir', function(assert) {
  var filename = resolve('content/index.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.index, '/')
    assert.end()
  })
})

test('page.index - nested directory', function(assert) {
  var filename = resolve('content/posts/index.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.index, '/posts')
    assert.end()
  })
})
