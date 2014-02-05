
const read = require('../lib/page')
    , assert = require('assert')
    , resolve = require('./resolve')
    , basedir = resolve('content')

describe('page.url', function(){
  it('converts .md to .html', function(done){
    var src = resolve('content/basic-page.md')

    read(src, basedir, function(err, page){
      if (err) return done(err)
      assert.equal(page.url, '/basic-page.html')
      done()
    })
  })

  it('does NOT convert pages lacking transforms')

  it('allows content-type to override', function(done){
    var src = resolve('content/raw-markdown.md')

    read(src, basedir, function(err, page){
      if (err) return done(err)
      assert.equal(page.url, '/raw-markdown.md')
      done()
    })
  })
})

