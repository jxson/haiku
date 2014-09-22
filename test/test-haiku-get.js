
const test = require('prova')
const haiku = require('../')
const source = require('./resolve')('source')

test('h.get(url, callback)', function(assert) {
  haiku(source)
  .get('/basic-page.html', function(err, page) {
    assert.error(err)
    assert.equal(page.name, 'basic-page.md')
    assert.end()
  })
})

test('h.get(name, callback)', function(assert) {
  haiku(source)
  .get('basic-page.md', function(err, page) {
    assert.error(err)
    assert.equal(page.name, 'basic-page.md')
    assert.end()
  })
})

test('h.get(slug, callback)', function(assert) {
  haiku(source)
  .get('basic-page', function(err, page) {
    assert.error(err)
    assert.equal(page.name, 'basic-page.md')
    assert.end()
  })
})

test('h.get(index, callback)', function(assert) {
  haiku(source)
  .get('/', function(err, page) {
    assert.error(err)
    assert.equal(page.name, 'index.md')
    assert.end()
  })
})

test('h.get(nested-index, callback) - no trailing slash', function(assert) {
  haiku(source)
  .get('/posts', function(err, page) {
    assert.error(err)
    assert.equal(page.url, '/posts/index.html')
    assert.end()
  })
})

test('h.get(nested-index, callback) - trailing slash', function(assert) {
  haiku(source)
  .get('/posts/', function(err, page) {
    assert.error(err)
    assert.equal(page.url, '/posts/index.html')
    assert.end()
  })
})
