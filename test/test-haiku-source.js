
const haiku = require('../')
const test = require('prova')
const path = require('path')

test('h.source([value])', function(assert) {
  var h = haiku()
  assert.equal(h.source(), process.cwd())

  h.source('./site')
  assert.equal(h.source(), path.resolve('./site'))

  h.source('/foo/bar')
  assert.equal(h.source(), '/foo/bar')

  h.source('../')
  assert.equal(h.source(), path.resolve('../'))

  assert.end()
})

test('haiku(pathname).source()', function(assert) {
  assert.equal(haiku().source(), process.cwd())
  assert.equal(haiku('./site').source(), path.resolve('./site'))
  assert.equal(haiku('/foo/bar').source(), '/foo/bar')
  assert.equal(haiku('../').source(), path.resolve('../'))
  assert.end()
})
