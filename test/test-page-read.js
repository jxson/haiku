
const Haiku = require('../').ctor
    , Page = require('../lib/page').ctor
    , resolve = require('./resolve')
    , assert = require('assert')

describe('page.read(callback)', function(){
  var haiku
    , page

  before(function(done){
    haiku = new Haiku({ src: resolve.src })
    page = new Page(resolve('content/basic-page.md'), haiku)
    page.read(done)
  })

  it('adds `meta` and `body` properties', function(){
    assert.ok(page.meta)
    assert.ok(page.content)
  })
})

