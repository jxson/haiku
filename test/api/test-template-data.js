
var haiku = require('../../lib')
  , pagify = require('../../lib/pagify')
  , assert = require('assert')
  , html = require('cheerio')

describe('template/mustache data', function(){
  before(function(){
    haiku
    .configure({ root: 'test/fixtures/template-data' })
  })

  describe('content', function(){
    it('lists pages', function(done){
      // This nesting is ridicuous
      haiku.read('content-list.md', function(err, page){
        if (err) return done(err)

        page.render(function(err, out){
          if (err) return done(err)
          var $ = html.load(out)

          assert.equal($('li').length, 5)

          done()
        })

        // console.log('page.render()', page.render())
      })
      // console.log('$("body")', $("body"))

      // page.render(function(err, out){
      //   if (err) return done(err)
      //
      //   done()
      // })
    })
    // // iterates content
    // {{#content}}
    // * {{ title }}
    // {{/content}}

    it('lists nested pages by directory')
    // // iterates nested content
    // {{#content}}
    //   {{#posts}}
    //   * {{ title }}
    //   {{/posts}}
    // {{/content}}
  })

  describe('content shortcuts', function(){
    it('has sections for nested directories')
    // {{#content/people}}
    // * {{ name }}
    // {{/content/people}}

    it('has sections for pages')
    // To access a page directly you could:
    //
    // {{#content/people/jxson.md}}
    // * {{ name }}
    // {{/content/people/jxson.md}}

  })

  it('lists all pages')
})
