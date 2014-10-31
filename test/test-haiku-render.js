
const test = require('prova')
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

    var $ = cheerio.load(output)
    var layout = $('body').attr('data-layout')

    console.log('output', output)

    assert.equal(layout, 'default')


    /*

    renders with page template variables

    * url
    * content-type
    * title
    * draft
    * enumerable
    * meta

        = yaml =
        foo: bar
        = yaml =

        # {{ page.title }}

        Just a page.

        Here are the page's available template variables:

        * page.url: <span class="url">{{ page.url }}</span>
        * page.content-type: <span class="content-type">{{ page.content-type }}</span>
        * page.date: <span class="date">{{ page.date }}</span>
        * page.title: <span class="title">{{ page.title }}</span>
        * page.draft: <span class="draft">{{ page.draft }}</span>
        * page.foo: <span class="foo">{{ page.foo }}</span>

    renders with haiku template variables

    * content

    */

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

*/
