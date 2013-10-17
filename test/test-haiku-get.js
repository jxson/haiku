
const haiku = require('../')
    , assert = require('assert')
    , resolve = require('./resolve')

describe('haiku.get(url, callback)', function(){
  it('finds by url', function(done){
    haiku({ src: resolve.src })
    .get('/basic-page.html', function(err, page){
      if (err) return done(err)
      assert.ok(page)
      assert.equal(page.url(), '/basic-page.html')
      done()
    })
  })

  it('finds index.html with directory urls')

  it('finds by name')
})
