
const test = require('tape')
const page = require('../lib/page')
const resolve = require('./resolve')
const filename = resolve('content/basic-page.md')
const basedir = resolve('content')
const now = require('date-now')
const rfc822 = require('rfc822-date')

test('var json = page.toJSON()', function(assert) {
  var body = '# {{ page.title }} \nFake page data'
  var json = page({
    filename: filename,
    basedir: basedir,
    mtime: now(),
    meta: { foo: 'bar' },
    body: body
  }).toJSON()

  assert.equal(json.url, '/basic-page.html')
  assert.equal(json.name, 'basic-page.md')
  assert.equal(json.slug, 'basic-page')
  assert.equal(json.draft, false)
  assert.equal(json.title, 'Basic page')
  assert.equal(json.foo, 'bar')
  assert.equal(json['last-modified'], rfc822(new Date(json.mtime)))
  assert.equal(json['content-type'], 'text/html')
  assert.equal(json.body, body)

  assert.end()
})
