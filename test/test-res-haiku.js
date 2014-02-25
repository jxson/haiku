
const assert = require('assert')
    , request = require('supertest')
    , server = require('./source/server')
    , cheerio = require('cheerio')

describe('res.haiku(url)', function(){
  it('404s non-existing content', function(done){
    request(server)
    .get('/non-existing')
    .expect(404, done)
  })

  it('renders markdown as html', function(done){
    request(server)
    .get('/basic-page.html')
    .expect('content-type', 'text/html')
    // .expect('etag', '')
    // .expect('last-modified', '')
    .expect(200, function(err, res){
      if (err) return done(err)

      var $ = cheerio.load(res.text)

      assert.equal($('title').text(), 'Basic page // haiku')
      assert.equal($('h1').text(), 'Basic page')
      assert.equal($('p:first-of-type').text(), 'Just a page.')

      done()
    })
  })
})
