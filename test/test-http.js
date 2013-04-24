var haiku = require('../')
  , assert = require('assert')
  , request = require('supertest')

describe('http', function(){
  var server

  before(function(){
    var path = require('path')
      , http = require('http')
      , haikopts = { src: path.resolve(__dirname, './fixtures/blog') }

    server = http.createServer(function(req, res){
      res.haiku = haiku(req, res, haikopts)
      res.haiku(req.url)
    })
  })

  describe('existing html content', function(){
    it('responds 200 ok', function(done){
      request(server)
      .get('/')
      .expect(200)
      .end(done)
    })

    it('responds with compiled html', function(done){
      request(server)
      .get('/')
      .expect(200)
      .expect('content-length', /\d/)
      .end(function(err, res){
        if (err) return done(err)

        var cheerio = require('cheerio')
          , $ = cheerio.load(res.text)

        assert.equal($('title').text().trim()
        , 'Just a blog for testing. | Test Blog'
        , 'Page has a bad title')

        assert.equal($('a:first-of-type').attr('href')
        , '/posts/001.html'
        , 'Page is missing a link to the first article')

        done()
      })
    })

    it('handles compression')

    it('handles caching')
  })

  describe('existing "other" content', function(){
    it('handles rss')
    it('handles json')
    it('handles text')

    it('handles other random things')
    // * svg
    // * vcard
    // * author defined (hal maybe?)
  })

  describe('static assets', function(){
    it('serves existing assets')

    it('404s on non-existing assets')
  })

  describe('non-existing content', function(){
    it('returns 404 not found', function(done){
      request(server)
      .get('/should-404')
      .expect(404)
      .end(done)
    })

    it('returns a meaningful body', function(done){
      request(server)
      .get('/should-404')
      .expect('content-type', 'text/plain')
      .expect(404, function(err, res){
        if (err) return done(err)

        assert.ok(res.text.length)

        done()
      })
    })
  })
})