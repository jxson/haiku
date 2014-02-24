
const haiku = require('../')
    , assert = require('assert')
    , resolve = require('./resolve')
    , src = resolve('src')

describe('content template variable', function(){
  var context

  before(function(done){
    haiku(src)
    .read(function(err){
      if (err) return done(err)
      context = this.context
      done()
    })
  })

  it('populates the content collection', function(){
    assert.ok(context, 'Missing h.context')
    assert.ok(context.content.length, 'context.content is not enumerable')
  })

  it('contains pages in the --content-dir', function(){
    var message = 'object in context.content is probably not a page :('

    context.content.forEach(function(page){
      assert.ok(page.url, message)
      assert.ok(page['content-type'], message)
      assert.ok(page.title, message)
    })
  })

  it('does not include indexes', function(){
    context.content.forEach(function(page){
      assert.ok(!page.url.match(/^index/), 'No index files allowed')
    })
  })

  it('does not include drafts', function(){
    context.content.forEach(function(page){
      assert.ok(!page.url.match(/^draft/), 'No drafts allowed')
    })
  })

  it('does not include non-enumerables', function(){
    context.content.forEach(function(page){
      assert.ok(page.url !== '/atom.xml', '"enumerable: false" did not work')
    })
  })

  it('does not include dot files')

  it('has accessors for sub-directories', function(){
    var message = 'object in context.content is probably not a page :('

    assert.ok(context.content.posts, 'Missing accessor for content/posts')

    context.content.posts.forEach(function(page){
      assert.ok(page.url, message)
      assert.ok(page['content-type'], message)
      assert.ok(page.title, message)
    })
  })

  it('sorts descending by date', function(){
    var first = context.content.posts[0]
      , last = context.content.posts[context.content.posts.length - 1]

    assert.equal(first.title, 'Five')
    assert.equal(last.title, 'One')
  })

  it('sorts by url if missing dates', function(){
    var first = context.content[0]
      , last = context.content[context.content.length - 1]

    assert.equal(first.title, 'Basic page')
    assert.equal(last.title, 'Just some markdown')
  })
})
