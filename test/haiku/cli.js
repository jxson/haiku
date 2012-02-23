var assert = require('assert')
  , cli = require('../../lib/haiku/cli')
  , path = require('path')
;

assert.isFunction = function(fn, message){
  if (typeof(fn) !== 'function') {
    assert.fail(typeof(fn), 'function', message, 'typeof', assert.isFunction);
  }
}

assert.isObject = function(obj, message){
  if (typeof(obj) !== 'object') {
    assert.fail(obj, 'object', message, '=== typeof', assert.isObject);
  }
}

describe('cli', function(){
  it('should be a CLI instance', function(){
    assert.isObject(cli, 'cli is NOT an object');
    assert.isFunction(cli.command, 'cli.command() is NOT a method');
    assert.isFunction(cli.option, 'cli.option() is NOT a method');
    assert.isFunction(cli.parse, 'cli.parse() is NOT a method');
    assert.isFunction(cli.dispatch, 'cli.dispatch() is NOT a method');
  });

  it('should have a CLI class constructor', function(){
    var instance
    ;

    assert.equal(typeof cli.CLI, 'function');

    instance = new cli.CLI();

    assert.isFunction(instance.command, 'instance.command() is NOT a method');
    assert.isFunction(instance.option, 'instance.option() is NOT a method');
    assert.isFunction(instance.parse, 'instance.parse() is NOT a method');
    assert.isFunction(instance.dispatch, 'instance.dispatch() is NOT a method');
  });

  describe('.option(params)', function(){
    var instance
    ;

    beforeEach(function(){
      instance = new cli.CLI();
    });

    describe('with valid params', function(){
      it('should add the option to the internal options object', function(){
        var params = { flag: 'config'
          , alias: 'c'
          , default: '.haiku/config.js'
          , type: path
        };

        instance.option(params);

        assert.equal(instance.options_.length, 1, 'bad length!');
      });
    }); // describe('with valid <params>', ...

    describe('without params', function(){
      it('should throw an invalid arguments error', function(){
        assert.throws(function(){
          instance.option();
        }, /invalid arguments for cli.option()/);
      });
    }); // describe('without <options>', ...
  }); // describe('options', ...
}); // describe('cli', ...
