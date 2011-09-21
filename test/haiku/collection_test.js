var helper = require('../test_helper')
  , vows = require('vows')
  , assert = require('assert')
  , path = require('path')
  , Site = require('haiku/site')
  , Collection = require('haiku/collection')
;

vows.describe('Collection').addBatch({
  'new Collection(options)': {
    'should be inherit from Event emitter': 'pending'
  },
  '#read()': 'pending',
  '#find()': {
    topic: function(){
      var _path = path.join('examples', 'basic', 'content')
        , site = new Site({ loglevel: 'warn' })
        , collection = new Collection({ 'site': site, path: _path });
      ;

      collection.on('ready', this.callback).read();
    },
    'should find content': function(){
      var index = this.find('/index.html');

      assert.isObject(index);
      assert.equal(index.url(), '/index.html');
    },
    'should find nested content': function(){
      var post = this.find('/posts/01-first-post.html');

      assert.isObject(post);
      assert.equal(post.url(), '/posts/01-first-post.html');
    }
  },
  '#collections()': 'pending',
  '#pages()': 'pending',
  '#toJSON()': 'pending'
}).export(module);
