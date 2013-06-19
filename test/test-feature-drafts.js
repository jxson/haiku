
var assert = require('assert')

describe('drafts', function(){
  var haiku = require('../')
    , path = require('path')
    , h

  before(function(){
    h = haiku(path.resolve(__dirname, 'fixtures', 'drafts'))
  })

  it('is findable', function(done){
    h.find('draft.md', function(err, page){
      if (err) return done(err)
      assert.ok(page)
      done()
    })
  })

  it('is not included in the collections', function(done){
    h.find('draft.md', function(err, page){
      if (err) return done()
      assert.ok(page, 'Page should exist')
      assert.equal(h.context.content.length, 1)
      done()
    })
  })
})
