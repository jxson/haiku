
const test = require('prova')
const read = require('../lib/read')
const assert = require('assert')
const resolve = require('./resolve')
const basedir = resolve('content')

test('page.date - defaults to undefined', function(assert) {
  var filename = resolve('content/defaults.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.date, undefined)
    assert.end()
  })
})

test('page.date - can be overridden by front-matter', function(assert) {
  var filename = resolve('content/overrides.md')
  var date = new Date('1977-05-25')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.ok(page.date instanceof Date, 'Bad type for page.date')
    assert.equal(page.date.getTime(), date.getTime())
    assert.end()
  })
})
