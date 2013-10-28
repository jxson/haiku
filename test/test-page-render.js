
const haiku = require('../')
    , resolve = require('./resolve')
    , assert = require('assert')
    , cheerio = require('cheerio')

describe('page.render(context, callback)', function(){
  var h

  before(function(){
    h = haiku(resolve.src)
  })

  it('renders content with `page` template variable', function(done){
    h.get('/basic-page.html', function(err, page){
      if (err) return done(err)

      page.render(function(err, rendered){
        if (err) return done(err)

        assert.ok(rendered.match('Just a page.'))
        assert.ok(rendered.match(page.url()), 'Missing page.url()')
        assert.ok(rendered.match(page.mime()), 'Missing page.mime()')
        // assert.ok(rendered.match(page.date()), 'Missing page.date()')
        assert.ok(rendered.match(page.foo()), 'Missing front-matter')
        assert.ok(rendered.match(page.content), 'Missing un-rendered content')

        done()
      })
    })
  })

  it('applies the default layout to html')
  it('does not apply the default layout to non-html')
})

//   before(function(done){
//     haiku = new Haiku({ src: resolve.src })
//     page = new Page(resolve('content/basic-page.md'), haiku)
//     page.read(done)
//   })

//   it('adds `meta` and `body` properties', function(){
//     assert.ok(page.meta)
//     assert.ok(page.content)
//   })
// })

