
const test = require('prova')
const haiku = require('../')
const EventEmitter = require('events').EventEmitter

test('creating instances', function(assert) {
  var h = haiku()

  assert.equal(typeof haiku, 'function', 'haiku should be a constructor')
  assert.ok(h instanceof haiku, 'should not require the "new" keyword')
  assert.ok(h instanceof EventEmitter, 'should be an EventEmitter')
  assert.end()
})

test('options', function(assert) {
  var h = haiku({ 'not-an-actual-option': true })
  var defaults = haiku.defaultOptions

  for (key in Object.keys(defaults)) {
    assert.equal(defaults[key], h.options[key])
  }

  assert.notOk(h.options['not-an-actual-option'])
  assert.end()
})
