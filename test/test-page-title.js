
const test = require('prova')
const read = require('../lib/read')
const assert = require('assert')
const resolve = require('./resolve')
const basedir = resolve('content')

test('page.title - defaults to a humanized page.name', function(assert) {
  var filename = resolve('content/defaults.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.title, 'Defaults')
    assert.end()
  })
})

test('page.title - can be overriden via front-matter', function(assert) {
  var filename = resolve('content/overrides.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.title, 'A Page With Overrides')
    assert.end()
  })
})
