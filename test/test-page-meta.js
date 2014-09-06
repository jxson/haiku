
const test = require('prova')
const read = require('../lib/read')
const assert = require('assert')
const resolve = require('./resolve')
const basedir = resolve('content')
const Page = require('../lib/page')

test('page.meta', function(assert) {
  var filename = resolve('content/basic-page.md')
  var p = Page(filename, basedir)

  assert.ok(p.meta, {}, 'page.meta should be pre-initialized.')
  assert.end()
})

test('page.meta - can be set via front-matter', function(assert){
  var filename = resolve('content/random-front-matter.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.meta.foo, 'oh')
    assert.equal(page.meta.bar, 'my')
    assert.equal(page.meta.baz, 'glob')
    assert.end()
  })
})
