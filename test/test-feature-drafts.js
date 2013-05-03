
var assert = require('assert')

describe('drafts', function(){
  var haiku = require('../')
    , path = require('path')

  before(function(){
    h = haiku(path.resolve(__dirname, 'fixtures', 'drafts'))
  })

  it('is findable', function(done){
    h.get('draft.md', function(err, page){
      if (err) return done(err)
      assert.ok(page)
      done()
    })
  })

  it('is not included in the collections', function(done){
    h.get('draft.md', function(err, page){
      if (err) return done()
      assert.ok(done)
      assert.equal(h.context.content.length, 1)
      done()
    })
  })

})
