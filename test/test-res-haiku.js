
var assert = require('assert')
  , request = require('supertest')
  , server = require('./server')

describe('res.haiku(url)', function(){
  describe('static serving', function(){
    it('200s existing files', function(done){
      request(server)
      .get('/')
      .expect(200)
      .end(done)
    })

    it('404s non-existing content')
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
