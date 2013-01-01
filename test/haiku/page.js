// var vows = require('vows')
//   , assert = require('assert')
//   , path = require('path')
//   , Site = require('../../lib/haiku/site')
//   , Page = require('../../lib/haiku/page')
//   , Collection = require('../../lib/haiku/collection')
//   , _ = require('underscore')
//   , events = require('events')
//   , sinon = require('sinon')
//   , fs = require('fs')
// ;
//
// vows.describe('Page').addBatch({
//   '.processors': {
//     '.textile': function(){
//       var input = 'This is *TEXTILE*'
//         , expected = '<p>This is <strong>TEXTILE</strong></p>\n'
//       ;
//
//       assert.equal(Page.processors.textile(input), expected);
//     },
//     '.mustache': function(){
//       var template = '{{ name }} is the pilot of {{>ship}}'
//         , view = { name: 'Han Solo' }
//         , site = { partials: { ship: 'Millennium Falcon' } }
//         , expected = 'Han Solo is the pilot of Millennium Falcon'
//       ;
//
//       assert.equal(Page.processors.mustache(template, view, site), expected);
//     },
//     '.markdown': function(){
//       var input = 'This is **MARKDOWN**'
//         , expected = '<p>This is <strong>MARKDOWN</strong></p>'
//       ;
//
//       assert.equal(Page.processors.markdown(input), expected);
//     }
//   },
//   'new Page(options)': {
//     topic: function(){
//       return new(Page);
//     },
//     'should be inherit from Event emitter': function(page){
//       assert.instanceOf(page, Page);
//       assert.equal(Page.super_, events.EventEmitter);
//     },
//     'default `options`': {
//       '`.loglevel` should === "info"': function(collection){
//         assert.equal(collection.options.loglevel, 'info');
//       }
//     }
//   },
//   '#name()': {
//     topic: function(){
//       var site = new Site({ loglevel: 'warn' })
//         , page = new Page({ site: site })
//       ;
//
//       return page;
//     },
//     'should exist': function(page){
//       assert.isFunction(page.name);
//     },
//     'should be the `.basename()` without the .mustache ext': function(page){
//       page.path = 'whatever.html.mustache';
//
//       assert.equal(page.name(), 'whatever.html');
//
//       page.path = 'whatever.md.mustache';
//
//       assert.equal(page.name(), 'whatever.md');
//
//       page.path = 'whatever.mustache';
//
//       assert.equal(page.name(), 'whatever');
//     }
//   },
//   '#basename()': {
//     topic: function(){
//       var site = new Site({ loglevel: 'warn' })
//         , page = new Page({ site: site })
//       ;
//
//       return page;
//     },
//     'should exist': function(page){
//       assert.isFunction(page.basename);
//     },
//     'should return the `path.basename(pages.path)`': function(page){
//       assert.equal(page.basename(), path.basename(page.path));
//     }
//   },
//   '#buildPath()': {
//     topic: function(){
//       var site = new Site({ loglevel: 'warn' })
//         , page = new Page({ site: site })
//       ;
//
//       return page;
//     },
//     'should exist': function(page){
//       assert.isFunction(page.buildPath);
//     },
//     'should handle files with .mustache extensions': function(page){
//       page.path = 'index.mustache';
//
//       assert.equal(page.buildPath(), 'index.html');
//     },
//     'should handle files with .xml.mustache extensions': function(page){
//       page.path = 'somedir/atom.xml.mustache';
//
//       assert.equal(page.buildPath(), 'somedir/atom.xml');
//     },
//     'should handle files with .html.mustache extensions': function(page){
//       page.path = 'foo.html.mustache';
//
//       assert.equal(page.buildPath(), 'foo.html');
//     },
//     'should handle files with .html extensions': function(page){
//       page.path = 'foo.html';
//
//       assert.equal(page.buildPath(), 'foo.html');
//     },
//     'should handle files with markdown extensions': function(page){
//       _.each(['.md', '.markdown', '.mdown', '.mkdn', '.mkd'], function(ext){
//         page.path = 'foo' + ext;
//
//         assert.equal(page.buildPath(), 'foo.html');
//       });
//     },
//     'should handle files with .textile extensions': function(page){
//       page.path = 'foo.textile';
//
//       assert.equal(page.buildPath(), 'foo.html');
//     }
//   },
//   '#cssID()': {
//     topic: function(){
//       var _path = path.resolve(path.join('examples', 'basic'))
//         , site = new Site({ root: _path })
//         , page = new Page({ site: site })
//       ;
//
//       return page;
//     },
//     'should exist': function(page){
//       assert.isFunction(page.cssID);
//     },
//     'when the page is part of the content collection': function(page){
//       // page.path = path.join(page.site.root, 'about-this-site.textile');
//       // page.parent = new Collection({ path: page.site.directories.content });
//
//       var _path = path.resolve(path.join('examples', 'basic'))
//         , site = new Site({ root: _path })
//         , collection = new Collection({
//             path: path.join(_path, 'content')
//           })
//         , page = new Page({
//             site: site,
//             parent: collection,
//             path: path.join(_path, 'content', 'about-this-site.textile')
//           })
//       ;
//
//       assert.equal(page.cssID(), 'about-this-site');
//     },
//     'when the page is part of other collections': function(){
//       var _path = path.resolve(path.join('examples', 'basic'))
//         , site = new Site({ root: _path })
//         , collection = new Collection({
//             site: site,
//             path: path.join(_path, 'content', 'posts')
//           })
//         , page = new Page({
//             site: site,
//             parent: collection,
//             path: path.join(_path, 'content', 'posts', 'first.md')
//           })
//       ;
//
//       assert.equal(page.cssID(), 'posts-first');
//     }
//   },
//   '#url()': {
//     topic: function(){
//       var site = new Site({ loglevel: 'warn' })
//         , page = new Page({ site: site })
//       ;
//
//       return page;
//     },
//     'should exist': function(page){
//       assert.isFunction(page.url);
//     },
//     'when there is NOT a `site.options.baseURL`': function(page){
//       _.each([
//         'index.mustache',
//         'atom.xml.mustache',
//         'posts/01-awesome.html.mustache',
//         'randomdir/who-knows.html'
//       ], function(_path){
//         page.path = _path;
//
//         assert.equal(page.url(), '/' + page.buildPath());
//       });
//     },
//     'when there is a `site.options.baseURL`': function(page){
//       var url = 'http://wut.ru/dir/';
//
//       page.site.options.baseURL = url;
//
//       _.each([
//         'index.mustache',
//         'atom.xml.mustache',
//         'posts/01-awesome.html.mustache',
//         'randomdir/who-knows.html'
//       ], function(_path){
//         page.path = _path;
//
//         assert.equal(page.url(), url + page.buildPath());
//       });
//     }
//   },
//   '#read()': {
//     'on successful `fs.readFile`': {
//       topic: function(){
//         var _path = path.join('examples',
//               'basic',
//               'content',
//               'index.mustache')
//           , site = new Site({ loglevel: 'warn' })
//           , page = new Page({ site: site, path: _path })
//         ;
//
//         page.on('ready', this.callback).read();
//       },
//       'should emit a ready event': function(){
//         assert.ok(true);
//       },
//       'should populate attributes': function(){
//         var page = this;
//
//         assert.isObject(page.attributes);
//         assert.equal(page.attributes.title, 'This is the homepage');
//         assert.equal(page.attributes.layout, 'default');
//       }
//     },
//     'errors': {
//       'on `fs.readFile`': {
//         'should throw': sinon.test(function(){
//           var site = new(Site)
//             , page = new Page({ site: site })
//             , err = new Error('Fake fs.readfile error')
//             , sinon = this
//           ;
//
//           sinon.stub(fs, 'readFile', function(_path, encoding, callback){
//             return callback(err, '');
//           });
//
//
//           assert.throws(function(){
//             page.read();
//           });
//         })
//       }
//     }
//   },
//   '#parser()': {
//     topic: function(){
//       var site = new Site({ loglevel: 'warn' })
//         , page = new Page({ site: site })
//       ;
//
//       return page;
//     },
//     'when the `page.path` is defined': {
//       'should know about markdown extensions': function(page){
//         _.each(Page.extensions.markdown, function(extension){
//           page.path = 'markdown-file' + extension;
//
//           assert.equal(page.parser(), 'markdown');
//         });
//
//         page.path = 'markdown-file.md.mustache';
//         assert.equal(page.parser(), 'markdown');
//       },
//       'should know about textile extensions': function(page){
//         page.path = 'textile-document.textile';
//
//         assert.equal(page.parser(), 'textile');
//       },
//       'should know about html extensions': function(page){
//         _.each(Page.extensions.html, function(extension){
//           page.path = 'html-file' + extension;
//
//           assert.equal(page.parser(), undefined);
//         });
//       },
//     },
//     'when the `page.path` is NOT defined': function(page){
//       assert.isUndefined(page.parser());
//     }
//   },
//   '#renderWithoutLayout(attributes)': {
//     topic: function(){
//       var site = new Site({ loglevel: 'warn' })
//         , page = new Page({ site: site })
//       ;
//
//       return page;
//     },
//     'with the `attributes` argument': function(page){
//       var attributes = { qip: 'random cuteness' };
//
//       page.template = 'A string with {{ qip }}';
//
//       assert.equal(page.renderWithoutLayout(attributes),
//         'A string with random cuteness');
//
//       page.path = 'faking-it.md';
//       page.template = '\nA paragraph with {{ qip }}\n';
//
//       assert.equal(page.renderWithoutLayout(attributes),
//         '<p>A paragraph with random cuteness</p>');
//     },
//     'without the `attributes` argument': function(page){
//       page.path = 'faking-it.mustache';
//       page.template = 'A string with nothing';
//
//       assert.equal(page.renderWithoutLayout(), 'A string with nothing');
//
//       page.path = 'faking-it.md';
//       page.template = '\nA paragraph with nothing\n';
//
//       assert.equal(page.renderWithoutLayout(),
//         '<p>A paragraph with nothing</p>');
//     }
//   },
//   '#toJSON()': {
//     topic: function(){
//       // var site = new Site({ loglevel: 'warn' })
//       //   , page = new Page({
//       //       path: path.normalize(path.join())
//       //       site: site
//       //     })
//       // ;
//       //
//
//
//       var _path = path.resolve(path.join('examples', 'basic'))
//         , site = new Site({ root: _path })
//         , collection = new Collection({
//             path: path.join(_path, 'content')
//           })
//         , page = new Page({
//             site: site,
//             parent: collection,
//             path: path.join(_path, 'content', 'about-this-site')
//           })
//       ;
//
//       page.template = 'blah!';
//
//       return page;
//     },
//     'should exist': function(page){
//       assert.isFunction(page.toJSON);
//     },
//     'should include `page.attributes`': function(page){
//       page.attributes = {
//         title: 'Some Imaginary Post'
//       };
//
//       var json = page.toJSON();
//
//       assert.include(json, 'title');
//       assert.equal(json.title, page.attributes.title);
//     },
//     'should include a content property': function(page){
//       var json = page.toJSON();
//
//       assert.include(json, 'content');
//       assert.equal(json.content(), page.template);
//     },
//     'should include the cssID property': function(page){
//       var json = page.toJSON();
//
//       assert.include(json, 'cssID');
//     }
//   },
//   '#render()': {
//     topic: function(){
//       return new(Page);
//     },
//     'should be defined': function(page){
//       assert.isFunction(page.render)
//     },
//     'after `site.read()`': {
//       topic: function(){
//         var promise = new(events.EventEmitter)
//           , _path = path.join('examples', 'basic')
//           , site = new Site({ root: _path, loglevel: 'warn' })
//         ;
//
//         site.on('ready', function(){
//           var page = this.find('/index.html');
//
//           promise.emit('success', page);
//         }).read();
//
//         return promise;
//       },
//       'with a layout': function(page){
//         page.attributes.layout = 'default';
//
//         var content = page.render();
//
//         assert.isString(content);
//         assert.match(content, /<body>/);
//       },
//       'without a layout': function(page){
//         page.attributes.layout = undefined;
//
//         var content = page.render()
//           , attributes = { site: page.site.toJSON() }
//         ;
//
//         assert.isString(content);
//         assert.equal(content.split(' ').join(''),
//           page.renderWithoutLayout(attributes).split(' ').join(''));
//       },
//       'with a layout === false': function(page){
//         page.attributes.layout = false;
//
//         var content = page.render()
//           , attributes = { site: page.site.toJSON() }
//         ;
//
//         assert.isString(content);
//         assert.equal(content.split(' ').join(''),
//           page.renderWithoutLayout(attributes).split(' ').join(''));
//       },
//       'when using tags': {
//         topic: function(){
//           var promise = new(events.EventEmitter)
//             , _path = path.join('examples', 'tags')
//             , site = new Site({ root: _path })
//           ;
//
//           site.on('ready', function(){
//             var post = this.find('/posts/02-node.html');
//
//             promise.emit('success', post);
//           }).read();
//
//           return promise;
//         },
//         'should have related pages': function(post){
//           assert.isArray(post.toJSON().related());
//
//           var relatedURLS = _.map(post.toJSON().related(), function(p){
//             return p.url();
//           });
//
//           // shouldn't include itself
//           assert.isFalse(_.include(relatedURLS, post.url()));
//
//           // should stuff with similar tags
//           assert.include(relatedURLS, '/posts/01-javascript.html');
//           assert.include(relatedURLS, '/posts/04-ruby.html');
//           assert.include(relatedURLS, '/posts/05-kittens.html');
//           assert.include(relatedURLS, '/posts/01-javascript.html');
//
//           // shouldn't include stuff without similar tags
//           assert.isFalse(_.include(relatedURLS, '/posts/03-php.html'));
//         }
//       }
//     }
//   },
// }).export(module);