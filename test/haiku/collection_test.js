var helper = require('../test_helper')
  , vows = require('vows')
  , assert = require('assert')
  , path = require('path')
  , Site = require('haiku/site')
  , Collection = require('haiku/collection')
  , events = require('events')
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
  '#read()': 'pending',
  '#find()': {
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
    'should find content': function(collection){
      var index = collection.find('/index.html');

      assert.isObject(index);
      assert.equal(index.url(), '/index.html');
    },
    'should find nested content': function(collection){
      var post = collection.find('/posts/01-first-post.html');

      assert.isObject(post);
      assert.equal(post.url(), '/posts/01-first-post.html');
    }
  },
  '#collections()': 'pending',
  '#pages()': 'pending',
  '#toJSON()': 'pending'
}).export(module);
