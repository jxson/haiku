
const test = require('prova')
const read = require('../lib/read')
const assert = require('assert')
const resolve = require('./resolve')
const basedir = resolve('content')

test('page.etag', function(assert) {
  var filename = resolve('content/defaults.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.ok(page.etag, 'page is missing etag')
    assert.end()
  })
})
