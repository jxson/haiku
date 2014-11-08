
const test = require('tape')
const haiku = require('../')
const source = require('./resolve')('source')
const Page = require('../lib/page')
const cheerio = require('cheerio')

test('h.render(key, callback)', function(assert) {
  haiku(source)
  .render('/basic-page.html', function(err, output) {
    assert.error(err)
    assert.ok(this instanceof Page, 'callback should be bound to page')
    assert.ok(output, 'should have output')

    var page = this
    var $ = cheerio.load(output)
    var layout = $('body').attr('data-layout')

    assert.equal(layout, 'default')
    assert.equal($('title').text(), page.title)
    assert.equal($('.title').text(), page.title)
    assert.equal($('.url').text(), page.url)
    assert.equal($('.content-type').text(), page['content-type'])
    assert.equal($('.last-modified').text(), page['last-modified'])
    assert.equal($('.etag').text(), page.etag)
    assert.equal($('.draft').text(), 'false')
    assert.equal($('.enumerable').text(), 'true')
    assert.equal($('.foo').text(), page.meta.foo)

    assert.end()
  })
})

/*

content-type:

* does not compile raw markdown

*/

/*

allows extra context

* doesn't squash other vars though

*/

/*

layouts:

* applies default layout to html
* does not apply the default layout to non-html
* allows override via front-matter

*/

/*

partials:

* renders with arbitrary templates/partials
* partials from templates
* partials from pages

*/
