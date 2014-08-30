
const test = require('prova')
const page = require('../lib/page')

test('creating instances', function(assert) {
  var p = page('filename', 'basedir')

  assert.equal(typeof page, 'function', 'haiku should be a constructor')
  assert.ok(p instanceof page, 'should not require the "new" keyword')
  assert.end()
})
