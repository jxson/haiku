var assert = require('assert')
  , cli = require('../../lib/haiku/cli')
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
  });

  it('should have a CLI class constructor', function(){
    var instance
    ;

    assert.equal(typeof cli.CLI, 'function');

    instance = new cli.CLI();

    assert.isFunction(instance.command, 'instance.command() is NOT a method');
    assert.isFunction(instance.option, 'instance.option() is NOT a method');
    assert.isFunction(instance.parse, 'instance.parse() is NOT a method');
  });
}); // describe('cli', ...
