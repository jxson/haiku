
const test = require('prova')
const haiku = require('../')
const source = require('./resolve')('source')

test('h.read(callback)', function(assert) {
  var h = haiku(source)

  assert.plan(3)

  assert.ok(h.is('new'))

  h.read(function(err) {
    assert.ifError(err)
    assert.ok(h.is('ready'))
  })
})

test('h.read(callback) - Bad content-dir', function(assert) {
  var h = haiku('does-not-exist')
  var content = h.resolve('content-dir')

  assert.plan(3)

  h.read(function(err){
    assert.ok(err)
    assert.ok(err.stack)
    assert.ok(err.message.match(content))
  })
})
