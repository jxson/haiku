var vows = require('vows')
  , assert = require('assert')
  , path = require('path')
  , Site = require('../../lib/haiku/site')
  , Collection = require('../../lib/haiku/collection')
  , events = require('events')
  , _ = require('underscore')
  , Page = require('../../lib/haiku/page')
  , sinon = require('sinon')
  , fs = require('fs')
;

vows.describe('Collection').addBatch({
  'new Collection(options)': {
    topic: function(){
      return new(Collection);
    },
    'should be inherit from Event emitter': function(collection){
      assert.instanceOf(collection, Collection);
      assert.equal(Collection.super_, events.EventEmitter)
    },
    'default `options`': {
      '`.parent` should === "root"': function(collection){
        assert.equal(collection.options.parent, 'root');
      },
      '`.loglevel` should === "info"': function(collection){
        assert.equal(collection.options.loglevel, 'info');
      }
    }
  },
  '#basename()': {
    topic: function(){
      return new(Collection);
    },
    'should exist': function(collection){
      assert.isFunction(collection.basename);
    },
    'should return `path.basename(collection.path)`': function(collection){
      assert.equal(collection.basename(), path.basename(collection.path));
    }
  },
  '#read()': {
    topic: function(){
      return new(Collection);
    },
    'should exist': function(collection){
      assert.isFunction(collection.read);
    },
    'when `fs.readdir` is a success': {
      topic: function(){
        var promise = new(events.EventEmitter)
          , _path = path.join('examples', 'basic')
          , site = new Site({ root: _path, loglevel: 'warn' })
          , collection = new Collection({
              site: site,
              path: path.join(_path, 'content')
            });
        ;

        collection.on('ready', function(){
          promise.emit('success', collection);
        }).read();

        return promise;
      },
      'should emit a ready event': function(collection){
        // This context will fail differently if the event doesn't fire but it
        // makes me feel better that this is here
        assert.ok(true);
      },
      'should populate the `collection.folder` object': function(collection){
        assert.equal(_.size(collection.folder), 4);

        assert.isObject(collection.folder['index.mustache']);
        assert.instanceOf(collection.folder['index.mustache'], Page);

        assert.isObject(collection.folder['about-this-site.textile']);
        assert.instanceOf(collection.folder['about-this-site.textile'], Page);

        assert.isObject(collection.folder['posts']);
        assert.instanceOf(collection.folder['posts'], Collection);
      },
    },
    'errors': {
      'on `fs.readdir`': {
        'with NO error listeners':{
          'should throw': sinon.test(function(){
            var site = new(Site)
              , collection = new Collection({
                  site: site
                })
              , err = new Error('Fake fs.readdir error')
              , sinon = this
            ;

            sinon.stub(fs, 'readdir', function(_path, callback){
              return callback(err, []);
            });

            assert.throws(function(){
              collection.read();
            });

          })
        }
      },
      'on `fs.stat`': {
        'with NO error listeners':{
          'should throw': sinon.test(function(){
            var site = new(Site)
              , collection = new Collection({
                  site: site
                })
              , err = new Error('Fake fs.stat error')
              , sinon = this
            ;

            sinon.stub(fs, 'stat', function(_path, callback){
              return callback(err, {});
            });

            assert.throws(function(){
              collection.read();
            });
          })
        },
      }
    }
  },
  '#find()': {
    topic: function(){
      var promise = new(events.EventEmitter)
        , _path = path.join('examples', 'basic')
        , site = new Site({ root: _path, loglevel: 'warn' })
        , collection = new Collection({
            site: site,
            path: path.join(site.options.root, 'content')
          });
      ;

      collection.on('ready', function(){
        promise.emit('success', collection);
      }).read();

      return promise;
    },
    'should find content': function(collection){
      var home = collection.find('/index.html');

      assert.isObject(home);
      assert.equal(home.url(), '/index.html');
    },
    'should find nested content': function(collection){
      var post = collection.find('/posts/01-first-post.html');

      assert.isObject(post);
      assert.equal(post.url(), '/posts/01-first-post.html');
    }
  },
  '#index()': {
    topic: function(){
      return new(Collection);
    },
    'should exist': function(collection){
      assert.isFunction(collection.index);
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
      'on content collections': function(site){
        var home = site.content.index('/index.html')
          , index = site.content.index();
        ;

        assert.isObject(home);
        assert.instanceOf(home, Page);

        assert.isObject(index);
        assert.include(index, '/index.html');
        assert.include(index, '/about-this-site.html');
        assert.include(index, '/posts/02-second-post.html');
        assert.include(index, '/posts/01-first-post.html');
      },
      'on template collections': function(site){
        var templates = site.folder.templates.index()
          , partial = site.folder.templates.index('post')
        ;

        assert.isObject(templates);
        assert.include(_.keys(templates), 'post');
        assert.include(_.keys(templates), 'layouts/default');

        assert.isObject(partial);
        assert.instanceOf(partial, Page);
      }
    }
  },
  '#collections()': {
    'should exist': function(){
      var collection = new(Collection);

      assert.isFunction(collection.collections);
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
      'should return the child collections': function(site){
        var content = site.folder.content;

        assert.isArray(content.collections());
        _.each(content.collections(), function(child){
          assert.instanceOf(child, Collection);
        });
      }
    }
  },
  '#pages()': {
    'should exist': function(){
      var collection = new(Collection);

      assert.isFunction(collection.pages);
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
      'should return the child collections': function(site){
        var content = site.folder.content;

        assert.isArray(content.pages());
        _.each(content.pages(), function(child){
          assert.instanceOf(child, Page);
        });
      }
    }
  },
  '#toJSON()': {
    'should exist': function(){
      var collection = new(Collection);

      assert.isFunction(collection.toJSON);
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
        var content = site.folder.content;

        assert.isObject(content.toJSON());
      },
      'should have pages': function(site){
        var content = site.folder.content;

        assert.include(content.toJSON(), 'pages');
        assert.isArray(content.toJSON().pages);
      },
      'should have collections': function(site){
        var content = site.folder.content;

        assert.include(content.toJSON(), 'collections');
        assert.isObject(content.toJSON().collections);
      }
    }
  }
}).export(module);
