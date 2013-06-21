var haiku = require('../')
  , path = require('path')
  , assert = require('assert')
  , cheerio = require('cheerio')

describe('page.render(<callback>)', function(){
  var src = path.resolve(__dirname, './fixtures/blog')
    , index

  before(function(done){
    haiku(src)
    .find('index.md', function(err, page){
      index = page
      done(err)
    })
  })

  it('renders the page.body template', function(done){
    index.render(function(err, out){
      if (err) return done(err)

      assert.ok(out, 'Should have compiled output')

      var $ = cheerio.load(out)

      assert.ok($('title').text().match(/Just a blog for testing/)
      , 'Should have the title from the page front-matter')

      assert.equal($('li').length, 3, 'Should have a list of posts')

      done()
    })
  })
})
