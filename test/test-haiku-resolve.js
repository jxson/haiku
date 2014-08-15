
const haiku = require('../')
const test = require('prova')
const path = require('path')

test('h.resolve()', function(assert) {
  var h = haiku()

  assert.equal(h.resolve(), process.cwd())
  assert.end()
})


test('h.resolve("content-dir")', function(sub) {
  sub.test('default', function(assert) {
    var h = haiku()

    assert.equal(h.resolve('content-dir'), path.resolve('content'))
    assert.end()
  })

  sub.test('changed source', function(assert) {
    var h = haiku('/src/whatever')

    assert.equal(h.resolve('content-dir'), '/src/whatever/content')
    assert.end()
  })

  sub.test('absolute path', function(assert) {
    var h = haiku({ 'content-dir': '/foo/content' })

    assert.equal(h.resolve('content-dir'), '/foo/content')
    assert.end()
  })

  sub.test('relative path', function(assert) {
    var h = haiku({ 'content-dir': './random-content' })
    var expected = path.resolve(process.cwd(), 'random-content')

    assert.equal(h.resolve('content-dir'), expected)
    assert.end()
  })
})

test('h.resolve("build-dir")', function(sub) {
  sub.test('default', function(assert) {
    var h = haiku()

    assert.equal(h.resolve('build-dir'), path.resolve('build'))
    assert.end()
  })

  sub.test('changed source', function(assert) {
    var h = haiku('/src/whatever')

    assert.equal(h.resolve('build-dir'), '/src/whatever/build')
    assert.end()
  })

  sub.test('absolute path', function(assert) {
    var h = haiku({ 'build-dir': '/var/www' })

    assert.equal(h.resolve('build-dir'), '/var/www')
    assert.end()
  })

  sub.test('relative path', function(assert) {
    var h = haiku({ 'build-dir': './www' })
    var expected = path.resolve(process.cwd(), './www')

    assert.equal(h.resolve('build-dir'), expected)
    assert.end()
  })
})

test('h.resolve("templates-dir")', function(sub) {
  sub.test('default', function(assert) {
    var h = haiku()

    assert.equal(h.resolve('templates-dir'), path.resolve('templates'))
    assert.end()
  })

  sub.test('changed source', function(assert) {
    var h = haiku('/src/whatever')

    assert.equal(h.resolve('templates-dir'), '/src/whatever/templates')
    assert.end()
  })

  sub.test('absolute path', function(assert) {
    var h = haiku({ 'templates-dir': '/src/mustaches' })

    assert.equal(h.resolve('templates-dir'), '/src/mustaches')
    assert.end()
  })

  sub.test('relative path', function(assert) {
    var h = haiku({ 'templates-dir': './mustaches' })
    var expected = path.resolve(process.cwd(), './mustaches')

    assert.equal(h.resolve('templates-dir'), expected)
    assert.end()
  })
})

test('h.resolve("public-dir")', function(sub) {
  sub.test('default', function(assert) {
    var h = haiku()

    assert.equal(h.resolve('public-dir'), path.resolve('public'))
    assert.end()
  })

  sub.test('changed source', function(assert) {
    var h = haiku('/src/whatever')

    assert.equal(h.resolve('public-dir'), '/src/whatever/public')
    assert.end()
  })

  sub.test('absolute path', function(assert) {
    var h = haiku({ 'public-dir': '/src/static' })

    assert.equal(h.resolve('public-dir'), '/src/static')
    assert.end()
  })

  sub.test('relative path', function(assert) {
    var h = haiku({ 'public-dir': './static' })
    var expected = path.resolve(process.cwd(), './static')

    assert.equal(h.resolve('public-dir'), expected)
    assert.end()
  })
})
