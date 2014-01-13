
const haiku = require('../')
    , assert = require('assert')
    , resolve = require('./resolve')

describe('h.get(key, callback)', function(){
  it('finds by url', function(done){
    haiku(resolve('src'))
    .get('/basic-page.html', function(err, page){
      if (err) return done(err)
      assert.ok(page)
      assert.equal(page.url, '/basic-page.html')
      done()
    })
  })
})
