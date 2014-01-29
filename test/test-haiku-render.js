
const haiku = require('../')
    , assert = require('assert')
    , resolve = require('./resolve')
    , src = resolve('src')

describe('h.render(key, context, callback)', function(){
  it('binds `this` to page instance')

  it('renders the page.content template', function(done){
    haiku(src)
    .render('/basic-page.html', function(err, output){
      if (err) return done(err)

      assert(output.match('<p>Just a page.</p>'))

      done()
    })
  })

  it('renders with page context')
  it('renders with haiku context')
  it('passes context into the template')
  it('does not squash haiku context')
  it('applies the default layout to html')
  it('does not apply the default layout to non-html')
  it('renders with arbitrary templates/partials')
})
