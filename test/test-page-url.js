
const Haiku = require('../').ctor
    , Page = require('../lib/page').ctor
    , resolve = require('./resolve')
    , assert = require('assert')

describe('page.url()', function(){
  var haiku
    , page

  before(function(){
    haiku = new Haiku({ src: resolve.src })
    page = new Page('fake-filename', haiku)
  })

  it('reequires page.read()', function(){
    assert.throws(function(){
      page.url()
    }, /reequires page.read()/)
  })

  it('converts .md to .html', function(done){
    page.src = resolve('content/basic-page.md')
    page.read(function(err){
      if (err) return done(err)
      assert.equal(page.url(), '/basic-page.html')
      done()
    })
  })

  it('does NOT convert pages lacking transforms')
  it('allows content-type to override')
})

