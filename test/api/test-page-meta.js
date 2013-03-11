
var haiku = require('../../lib')
  , assert = require('assert')
  , path = require('path')

describe('page.meta', function(){
  before(function(){
    var root = path.resolve(__dirname, '../fixtures/front-matter')

    haiku.configure({ root: root })
  })

  it('does not require front-matter', function(done){
    haiku.read('nothing.md', function(err, page){
      if (err) return done(err)

      assert.ok(page.meta)

      done()
    })
  })

  it('extracts from YAML', function(done){
    haiku.read('yaml.md', function(err, page){
      if (err) return done(err)

      assert.equal(page.title, 'Yo, this is some YAML')

      done()
    })
  })

  it('extracts from TOML')
  it('extracts from JSON')
})
