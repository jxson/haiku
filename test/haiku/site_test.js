var helper = require('../test_helper')
  , vows = require('vows')
  , assert = require('assert')
  , sinon = require('sinon')
  , Site = require('haiku/site')
  , Logger = require('haiku/logger')
  , path = require('path')
  , events = require('events')
  , _ = require('underscore')
  , Collection = require('haiku/collection')
  , Page = require('haiku/page')
  , fs = require('fs')
  , child_process = require('child_process')
;

vows.describe('haiku.Site').addBatch({
  'A new instance\'s': {
    topic: function(){
      return new(Site);
    },
    '*default* `options`': {
      topic: function(site){
        return site.options;
      },
      '`root` should be `process.cwd()`': function(options){
        assert.ok(options.root);
        assert.equal(options.root, process.cwd());
      },
      '`buildDir` should be "build"': function(options){
        assert.ok(options.buildDir);
        assert.equal(options.buildDir, 'build');
      },
      '`contentDir` should be "content"': function(options){
        assert.ok(options.contentDir);
        assert.equal(options.contentDir, 'content');
      },
      '`templatesDir` should be "templates"': function(options){
        assert.ok(options.templatesDir);
        assert.equal(options.templatesDir, 'templates');
      },
      '`publicDir` should be "public"': function(options){
        assert.ok(options.publicDir);
        assert.equal(options.publicDir, 'public');
      },
      '`index` should be "index"': function(options){
        assert.ok(options.index);
        assert.equal(options.index, 'index.html');
      },
      '`baseURL` should be "/"': function(options){
        assert.ok(options.baseURL);
        assert.equal(options.baseURL, '/');
      }
    },
    '*default* `directories`': {
      topic: function(site){
        return site.directories;
      },
      'has property `content`': function(directories){
        var _path = path.join(process.cwd(), 'content');

        assert.include(directories, 'content');
        assert.equal(directories.content, _path);
      },
      'has property `templates`': function(directories){
        var _path = path.join(process.cwd(), 'templates');

        assert.include(directories, 'templates');
        assert.equal(directories.templates, _path);
      },
      'has property `public`': function(directories){
        var _path = path.join(process.cwd(), 'public');

        assert.include(directories, 'public');
        assert.equal(directories.public, _path);
      }
    },
    'it should have a logger': function(site){
      assert.isObject(site.logger);
      assert.instanceOf(site.logger, Logger);
      assert.equal(site.logger.level, 'info');
    }
  },
  '#find(route)': {
    topic: function(){
      var site = new(Site)
      site.content = { find: function(){} }; // faker for stubbing
      return site;
    },
    'should call the find method on the content': sinon.test(function(site){
      this.stub(site.content, 'find');

      site.find('/about.html');
      assert.ok(site.content.find.called);
      assert.equal(site.content.find.args[0][0], '/about.html');
    }),
    'when the `route` is for an index': sinon.test(function(site){
      this.stub(site.content, 'find');

      site.find('/');
      assert.ok(site.content.find.called);
      assert.equal(site.content.find.args[0][0], '/index.html');

      site.find('/posts/');
      assert.ok(site.content.find.called);
      assert.equal(site.content.find.args[1][0], '/posts/index.html');
    })
  },
  '#read()': {
    topic: function(){
      var _path = path.join('examples',
            'basic')
        , site = new Site({ root: _path, loglevel: 'warn' })
      ;

      return site;
    },
    'should be defined': function(site){
      assert.isFunction(site.read);
    },
    'events': {
      topic: function(site){
        var promise = new(events.EventEmitter)

        site.on('ready', function(){
          var site = this;

          promise.emit('success', site);
        }).read();

        return promise;
      },
      'should emit a ready event': function(site){
        // kinda pointless since there would be a different failure if the
        // event doesn't fire...
        assert.ok(true);
      },
      'should populate `site.content`': function(site){
        assert.isObject(site.content);
        assert.instanceOf(site.content, Collection);
      },
      'should populate `site.layouts`': function(site){
        assert.isObject(site.layouts);
        assert.instanceOf(site.layouts, Collection);
      },
      'should populate `site.partials`': function(site){
        assert.isObject(site.partials);

        _.each(site.partials, function(partial){
          assert.isString(partial);
        })
      },
      'should populate non-default collections': function(site){
        assert.isObject(site.content.folder.posts);
        assert.instanceOf(site.content.folder.posts, Collection);
      }
    },
    'errors': {
      'on `fs.stat`': {
        'should throw': sinon.test(function(){
          var site = new(Site)
            , err = new Error('Fake fs.stats error')
            , sinon = this
          ;

          sinon.stub(fs, 'stat', function(_path, callback){
            return callback(err, {});
          });

          assert.throws(function(){
            site.read();
          });
        })
      },
      'on `fs.stat` when `! stats.isDirectory`': {
        'should throw': sinon.test(function(){
          var site = new(Site)
            , sinon = this
            , message
          ;

          sinon.stub(fs, 'stat', function(_path, callback){
            return callback(null, { isDirectory: false });
          });


          assert.throws(function(){
            site.read();
          });
        })
      }
    }
  },
  '#find(route)': {
    'after `site.read()`': {
      topic: function(){
        var promise = new(events.EventEmitter)
          , _path = path.join('examples', 'basic')
          , site = new Site({ root: _path, loglevel: 'warn' })
        ;

        site.on('ready', function(){
          promise.emit('success', site);
        }).read();

        return promise;
      },
      'should find the index': function(site){
        assert.instanceOf(site.find(), Page);
        assert.instanceOf(site.find(''), Page);
        assert.instanceOf(site.find('/index.html'), Page);

        assert.equal(site.find().url(), '/index.html');
        assert.equal(site.find().url(''), '/index.html');
        assert.equal(site.find().url('/index.html'), '/index.html');
      },
      'should find content': function(site){
        var url = '/posts/01-first-post.html';

        assert.instanceOf(site.find(url), Page);
        assert.equal(site.find(url).url(), url);
      },
      'should find the index for collections': function(site){
        assert.instanceOf(site.find('/posts/'), Page);
        assert.equal(site.find('/posts/').url(), '/posts/index.html');

        assert.instanceOf(site.find('/posts'), Page);
        assert.equal(site.find('/posts').url(), '/posts/index.html');
      }
    }
  },
  '#toJSON()': {
    'should exist': function(){
      var site = new(Site);

      assert.isFunction(site.toJSON);
    },
    'after `site.read()`': {
      topic: function(){
        var promise = new(events.EventEmitter)
          , _path = path.join('examples', 'basic')
          , site = new Site({ root: _path, loglevel: 'warn' })
        ;

        site.on('ready', function(){
          promise.emit('success', site);
        }).read();

        return promise;
      },
      'should be an object': function(site){
        assert.isObject(site.toJSON());
      },
      'should have pages': function(site){
        assert.include(site.toJSON(), 'pages');
        assert.isArray(site.toJSON().pages);
      },
      'should have collections': function(site){
        assert.include(site.toJSON(), 'collections');
        assert.isObject(site.toJSON().collections);
      }
    }
  },
  '#build()': {
    topic: function(){
      return new(Site);
    },
    'should exist': function(site){
      assert.isFunction(site.build);
    }
    // 'after `site.read()`': {
    //   topic: function(){
    //     var promise = new(events.EventEmitter)
    //       , _path = path.join('examples', 'basic')
    //       , site = new Site({ root: _path, loglevel: 'warn' })
    //     ;
    //
    //     site.on('ready', function(){
    //       promise.emit('success', site);
    //     }).read();
    //
    //     return promise;
    //   },
    //   '`post.build()`': {
    //     topic: function(site){
    //       var promise = new(events.EventEmitter);
    //
    //       site.on('build', function(){
    //         promise.emit('success', site);
    //       }).build();
    //
    //       return promise;
    //     },
    //     'i dont know how to test this yet': function(site){
    //
    //       fs.rmdirSync(site.directories.build);
    //       child_process.exec("rm -r " + site.directories.build)
    //     }
    //   }
    // }
  }
}).export(module);
