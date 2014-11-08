
const test = require('tape')
const page = require('../lib/page')

test('creating instances', function(assert) {
  var p = page({
    filename: 'filename',
    basedir: 'basedir'
  })

  assert.equal(typeof page, 'function', 'haiku should be a constructor')
  assert.ok(p instanceof page, 'should not require "new"')
  assert.end()
})
