
const haiku = require('../')
    , assert = require('assert')
    , resolve = require('./resolve')
    , src = resolve('src')

describe('h.get(key, callback)', function(){
  it('finds by url', function(done){
    haiku(src)
    .get('/basic-page.html', function(err, page){
      if (err) return done(err)
      assert.ok(page)
      assert.equal(page.url, '/basic-page.html')
      done()
    })
  })

  it('finds index.html within directories', function(done){
    haiku(src)
    .get('/', function(err, page){
      if (err) return done(err)
      assert.ok(page)
      assert.equal(page.url, '/index.html')
      done()
    })
  })

  it('finds by name', function(done){
    haiku(src)
    .get('/basic-page.md', function(err, page){
      if (err) return done(err)
      assert.ok(page)
      assert.equal(page.url, '/basic-page.html')
      done()
    })
  })
})
