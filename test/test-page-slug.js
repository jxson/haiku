
const test = require('prova')
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
