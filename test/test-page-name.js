
const test = require('prova')
const read = require('../lib/read')
const assert = require('assert')
const resolve = require('./resolve')
const basedir = resolve('content')

test('page.name', function(assert) {
  var filename = resolve('content/basic-page.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.name, 'basic-page.md')
    assert.end()
  })
})
