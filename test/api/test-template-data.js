
var haiku = require('../../lib')
  , pagify = require('../../lib/pagify')
  , assert = require('assert')
  , html = require('cheerio')

describe('template/mustache data', function(){
  before(function(done){
    haiku
    .configure({ root: 'test/fixtures/template-data' })
    .read(done)
  })

  // it('compiles content', function(done){
  //   haiku.read('foo.md', function(err, page){
  //     if (err) return done(err)
  //
  //     // console.log('this.haiku.root', haiku.root)
  //     // console.log('this.haiku["content-dir"]', haiku["content-dir"])
  //
  //     page.render(function(err, content){
  //       if (err) return done(err)
  //
  //       var $ = html.load(content)
  //
  //       assert.ok(content)
  //       // check for layout
  //       assert.equal($('title').text(), 'Foo | just testing')
  //       // check for content
  //       assert.equal($('body').text().trim(), 'Nothing here but Foo')
  //
  //       done()
  //     })
  //   })


  describe('content', function(){
    var $

    before(function(done){
      haiku
      .get('content-list.md')
      .render(function(err, out){
        if (err) return done(err)
        $ = html.load(out)
        done()
      })
    })

    it('lists pages', function(){
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
