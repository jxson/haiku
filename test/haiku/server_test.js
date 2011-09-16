var helper = require('../test_helper')
  , vows = require('vows')
  , assert = require('assert')
  , sinon = require('sinon')
  , haiku = require('haiku')
;

vows.describe('haiku.Server').addBatch({
  'new haiku.Server(options)': {
    'with *default* options': {
      topic: function(){ return new(haiku.Server); },
      'the `port` option should be `8080`': function(server){
        assert.equal(server.options.port, 8080);
      },
      'the `host` option should be `localhost`': function(server){
        assert.equal(server.options.host, 'localhost');
      }
    },
    'with options set': {
      topic: function(){
        return new haiku.Server({ host: '127.0.0.1', port: 1337 });
      },
      'should have the correct `port` option': function(server){
        assert.equal(server.options.port, 1337);
      },
      'should have the correct `localhost` option': function(server){
        assert.equal(server.options.host, '127.0.0.1');
      }
    }
  },
  '#run()': {
    topic: function(){ return new(haiku.Server); },
    'should call `server.app.listen`': function(server){
      sinon.stub(server.app, 'listen');

      server.run();

      assert.ok(server.app.listen.called);
      assert.equal(server.app.listen.args[0][0], server.options.port);
      assert.equal(server.app.listen.args[0][1], server.options.host);
    }
  }
}).export(module);
