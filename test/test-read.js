
const test = require('tape')
const read = require('../lib/read')
const resolve = require('./resolve')
const basedir = resolve('content')

test('read(filename, basedir) - stats error', function(assert) {
  var filename = resolve('content/does-not-exist.md')

  read(filename, basedir, function(err, page) {
    assert.ok(err instanceof Error)
    assert.equal(err.code, 'ENOENT')
    assert.end()
  })
})

test('read(filename, basedir) - read file error', function(assert) {
  var filename = resolve('content/posts')

  read(filename, basedir, function(err, page) {
    assert.ok(err instanceof Error)
    assert.equal(err.code, 'EISDIR')
    assert.end()
  })
})

test('read(filename, basedir) - front-matter parse error', function(assert) {
  var filename = resolve('bad-things/bad-front-matter.md')

  read(filename, basedir, function(err, page) {
    assert.ok(err instanceof Error)
    assert.equal(err.problem, 'mapping values are not allowed here')
    assert.end()
  })
})
