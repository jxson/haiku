
const haiku = require('../')
    , pctx = require('../lib/page-context')
    , assert = require('assert')
    , resolve = require('./resolve')
    , src = resolve('src')

// NOTE: since the `page` template variable is only assigned right before
// redering (inside the h.render() method) the best way to test it is to assign
// it manually after retrieving a page via h.get()
describe('page template variable', function(){
  it('allows arbitrary values via front-matter')
  it('allows the expansion of pages via front-matter')

  describe('page.title', function(){
    it('has a sane default')
    it('can be set via front matter')
  })

  describe('page.date', function(){
    it('defaults to undefined')
    it('can be set via front-matter')
  })

  describe('page.url', function(){
    it('is pre-set via the Page instance')
    it('can NOT be overriden')
  })

  describe('page.next', function(){
    it('provides the next page in the collection')
  })

  describe('page.previous', function(){
    it('provides the previous page in the collection')
  })
})
