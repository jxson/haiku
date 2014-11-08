
const test = require('tape')
const read = require('../lib/read')
const assert = require('assert')
const resolve = require('./resolve')
const basedir = resolve('content')
const path = require('path')

test('page.url - converts .md to .html', function(assert) {
  var filename = resolve('content/basic-page.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.url, '/basic-page.html')
    assert.end()
  })
})

test('page.url - only converts markdown', function(assert) {
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

test('page.url - can NOT be overridden', function(assert) {
  var filename = resolve('content/overrides.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.url, '/overrides.html')
    assert.end()
  })
})

test('page.url - considers --base-url', function(assert) {
  var filename = resolve('content/basic-page.md')
  var base = [
    '/foo',
    'http://foo.com',
    'http://foo.com/'
  ]
  var tests = 0

  base.forEach(function(baseurl) {
    read(filename, basedir, baseurl, function(err, page) {
      assert.error(err)
      assert.equal(page.url, path.join(baseurl, 'basic-page.html'))

      tests++

      if (tests === base.length) assert.end()
    })
  })
})
