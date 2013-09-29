
var assert = require('assert')
  , request = require('supertest')
  , server = require('./server')

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
