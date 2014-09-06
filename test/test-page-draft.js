
const test = require('prova')
const read = require('../lib/read')
const assert = require('assert')
const resolve = require('./resolve')
const basedir = resolve('content')

test('page.draft - defaults to false', function(assert) {
  var filename = resolve('content/defaults.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.draft, false)
    assert.end()
  })
})

test('page.draft - can be overridden', function(assert) {
  var filename = resolve('content/draft.md')

  read(filename, basedir, function(err, page) {
    assert.error(err)
    assert.equal(page.draft, true)
    assert.end()
  })
})

// var assert = require('assert')
//
// describe('drafts', function(){
//   var haiku = require('../')
//     , path = require('path')
//     , h
//
//   before(function(){
//     h = haiku(path.resolve(__dirname, 'fixtures', 'drafts'))
//   })
//
//   it('is findable', function(done){
//     h.find('draft.md', function(err, page){
//       if (err) return done(err)
//       assert.ok(page)
//       done()
//     })
//   })
//
//   it('is not included in the collections', function(done){
//     h.find('draft.md', function(err, page){
//       if (err) return done()
//       assert.ok(page, 'Page should exist')
//       assert.equal(h.context.content.length, 1)
//       done()
//     })
//   })
// })
