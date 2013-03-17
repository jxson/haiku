
var assert = require('assert')
  , run = require('comandante')
  , path = require('path')
  , root = path.join(__dirname, 'template-data')
  , reader = require('../helpers/reader')
  , read = reader({ cwd: root })

describe('template/mustache data', function(){
  before(function(done){
    run('haiku', [ 'build' ], { cwd: root })
    .on('error', done)
    .on('end', done)
  })

  describe('content', function(){
    var content

    before(function(done){
      content = read('/content-list.html', done)
    })

    it('only lists pages')

    it('sorts')

    // describe('has lists for nested content', function(){
    //
    // })
  })

  // xdescribe('directories', function(){
  //   describe('content', function(){
  //
  //   })
  //
  //   describe('nested content', function(){
  //
  //   })
  //
  //   it('lists pages', function(done){
  //     read()
  //     // // This nesting is ridicuous
  //     // haiku.read('content-list.md', function(err, page){
  //     //   if (err) return done(err)
  //     //
  //     //   page.render(function(err, out){
  //     //     if (err) return done(err)
  //     //
  //     //     console.log('out', out)
  //     //
  //     //     var $ = html.load(out)
  //     //
  //     //     assert.equal($('li').length, 5)
  //     //
  //     //     done()
  //     //   })
  //     //
  //     //   // console.log('page.render()', page.render())
  //     // })
  //     // // console.log('$("body")', $("body"))
  //     //
  //     // // page.render(function(err, out){
  //     // //   if (err) return done(err)
  //     // //
  //     // //   done()
  //     // // })
  //   })
  //   // // iterates content
  //   // {{#content}}
  //   // * {{ title }}
  //   // {{/content}}
  // })
  //
  // xdescribe('content shortcuts', function(){
  //   it('has sections for nested directories')
  //   // {{#content/people}}
  //   // * {{ name }}
  //   // {{/content/people}}
  //
  //   it('has sections for pages')
  //   // To access a page directly you could:
  //   //
  //   // {{#content/people/jxson.md}}
  //   // * {{ name }}
  //   // {{/content/people/jxson.md}}
  //
  // })
  //
  // it('lists all pages')
})
