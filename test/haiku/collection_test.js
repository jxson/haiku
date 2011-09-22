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
  '#read()': 'pending',
  // TODO: use a promise based method
  // '#find()': {
  //   topic: function(){
  //     var _path = path.join('examples', 'basic', 'content')
  //       , site = new Site({ loglevel: 'warn' })
  //       , collection = new Collection({ 'site': site, path: _path });
  //     ;
  //
  //     collection.on('ready', this.callback).read();
  //   },
  //   'should find content': function(){
  //     var index = this.find('/index.html');
  //
  //     assert.isObject(index);
  //     assert.equal(index.url(), '/index.html');
  //   },
  //   'should find nested content': function(){
  //     var post = this.find('/posts/01-first-post.html');
  //
  //     assert.isObject(post);
  //     assert.equal(post.url(), '/posts/01-first-post.html');
  //   }
  // },
  '#collections()': 'pending',
  '#pages()': 'pending',
  '#toJSON()': 'pending'
}).export(module);
