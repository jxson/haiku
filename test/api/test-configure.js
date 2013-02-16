
var haiku = require('../../lib')
  , assert = require('assert')
  , path = require('path')

describe('haiku.configure(options)', function(){
  beforeEach(function(){
    haiku.configure(haiku.defaults)
  })

  it('sets haiku.root', function(){
    haiku.configure({ root: '../' })

    assert.equal(haiku.root, path.resolve(process.cwd(), '../'))
  })
})


//   '`buildDir` should be "build"': function(options){
//     assert.ok(options.buildDir);
//     assert.equal(options.buildDir, 'build');
//   },
//   '`contentDir` should be "content"': function(options){
//     assert.ok(options.contentDir);
//     assert.equal(options.contentDir, 'content');
//   },
//   '`templatesDir` should be "templates"': function(options){
//     assert.ok(options.templatesDir);
//     assert.equal(options.templatesDir, 'templates');
//   },
//   '`publicDir` should be "public"': function(options){
//     assert.ok(options.publicDir);
//     assert.equal(options.publicDir, 'public');
//   },
//   '`index` should be "index"': function(options){
//     assert.ok(options.index);
//     assert.equal(options.index, 'index.html');
//   },
// },
// '*default* `directories`': {
//   topic: function(site){
//     return site.directories;
//   },
//   'has property `content`': function(directories){
//     var _path = path.join(process.cwd(), 'content');
//
//     assert.include(directories, 'content');
//     assert.equal(directories.content, _path);
//   },
//   'has property `templates`': function(directories){
//     var _path = path.join(process.cwd(), 'templates');
//
//     assert.include(directories, 'templates');
//     assert.equal(directories.templates, _path);
//   },
//   'has property `public`': function(directories){
//     var _path = path.join(process.cwd(), 'public');
//
//     assert.include(directories, 'public');
//     assert.equal(directories.public, _path);
//   }
// },
