
const page = require('../lib/page')
    , assert = require('assert')
    , resolve = require('./resolve')

describe('page.url', function(){
  it('converts .md to .html', function(done){
    var options = { src: resolve('content/basic-page.md')
        , 'content-dir': resolve('content')
        }

    page(options, function(err, entity){
      if (err) return done(err)
      assert.equal(entity.url, '/basic-page.html')
      done()
    })
  })

  it('does NOT convert pages lacking transforms')
  it('allows content-type to override')
})

