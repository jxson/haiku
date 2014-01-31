
const read = require('../lib/page')
    , assert = require('assert')
    , resolve = require('./resolve')

describe('page.url', function(){
  it('converts .md to .html', function(done){
    var src = resolve('content/basic-page.md')
      , basedir = resolve('content')

    read(src, basedir, function(err, page){
      if (err) return done(err)
      assert.equal(page.url, '/basic-page.html')
      done()
    })
  })

  it('does NOT convert pages lacking transforms')
  it('allows content-type to override')
})

