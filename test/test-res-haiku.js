
var assert = require('assert')
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
    .get('/')
    .expect('content-type', 'text/html')
    .expect('etag', '')
    .expect('last-modified', '')
    .expect(200, function(err, res){
      if (err) return done(err)
      assert.ok(res.text)
      console.log('res.text', res.text)
      done()
    })

    //     , $ = cheerio.load(res.text)

    //   assert.equal($('title').text().trim()
    //   , 'Just a blog for testing. | Test Blog'
    //   , 'Page has a bad title')

    //   assert.equal($('a:first-of-type').attr('href')
    //   , '/posts/001.html'
    //   , 'Page is missing a link to the first article')
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
