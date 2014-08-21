
const test = require('prova')
const haiku = require('../')
const source = require('./resolve')('source')

test('h.get(key, callback) - by name', function(assert) {
  assert.plan(2)

  haiku(source)
  .get('basic-page.md', function(err, page) {
    assert.ifError(err)
    assert.equal(page.name, 'basic-page.md')
  })
})
