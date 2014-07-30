
const test = require('prova')
const haiku = require('../')

test('creating instances', function(assert) {
  assert.equal(typeof haiku, 'function', 'should be a constructor')
  assert.ok(haiku() instanceof haiku)
  assert.end()
})
