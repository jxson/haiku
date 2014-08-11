
const haiku = require('../')
const test = require('prova')
const path = require('path')

test('h.resolve()', function(assert) {
  var h = haiku()

  assert.equal(h.resolve(), process.cwd())
  assert.end()
})

test('h.resolve("content-dir")', function(assert) {
  var h = haiku()

  assert.equal(h.resolve('content-dir'), path.resolve('content'))
  assert.end()
})
