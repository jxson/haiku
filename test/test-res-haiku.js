
const assert = require('assert')
    , request = require('supertest')
    , server = require('./server')
    , cheerio = require('cheerio')

describe('res.haiku(url)', function(){
  it('404s non-existing content', function(done){
    request(server)
    .get('/non-existing')
    .expect(404, function(err, res){
      if (err) return done(err)
      assert.ok(res.text.length)
      done()
    })
  })

  it('renders markdown as html', function(done){
    request(server)
    .get('/markdown-to-html.html')
    .expect('content-type', 'text/html')
    // .expect('etag', '')
    // .expect('last-modified', '')
    .expect(200, function(err, res){
      if (err) return done(err)

      var $ = cheerio.load(res.text)

      assert.equal($('title').text(), 'Markdown to HTML // haiku')
      assert.equal($('h1').text(), 'Just some markdown')
      assert.equal($('p:first-of-type').text()
      , 'This will be rendered as HTML.')

      done()
    })
  })

/*

* renders markdown as html
* renders with extra context
* renders without layout
* renders non-default layout
* renders partials in pages
* handles generic media-types (rss, html, json, text, svg, vcard)
* media-type overload via front-matter (hal, .asc as text)
* gzips
* 304s and if-none-match
* 404s ignores

*/
})
