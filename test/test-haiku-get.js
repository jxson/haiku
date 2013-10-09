
const haiku = require('../')
    , path = require('path')
    , src = path.resolve(__dirname, './source')
    , assert = require('assert')

describe('haiku.get(url, callback)', function(){
  it('finds by url', function(done){
    haiku({ src: src, 'log-level': 'info' })
    .get('/basic-page.html', function(err, entity){
      if (err) return done(err)
      assert.ok(entity)
      done()
    })
  })

  it('finds index.html with directory urls')
  it('finds by name')
})
