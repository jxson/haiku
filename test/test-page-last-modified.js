
const test = require('prova')
const read = require('../lib/read')
const assert = require('assert')
const resolve = require('./resolve')
const basedir = resolve('content')
const rfc822 = require('rfc822-date')

test('page.lastmodified', function(assert) {
  var filename = resolve('content/basic-page.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page['last-modified'], rfc822(page.mtime))
    assert.end()
  })
})
