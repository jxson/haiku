var assert = require('assert')
  , haiku = require('../../lib/haiku')
  , EE = require('events').EventEmitter
;

describe('haiku.cli', function(){
  it('should be a function', function(){
    assert.equal(typeof haiku.cli, 'function');
  });

  it('should have a CLI class property', function(){
    assert.equal(typeof haiku.cli.CLI, 'function');
  });

  describe('cli instance', function(){
    var cli = new haiku.cli.CLI()
    ;

    it('should be an instance of an event emitter', function(){
      assert.ok(cli instanceof EE)
    });

    it('should have a .start() method', function(){
      assert.equal(typeof cli.start, 'function');
    });
  }); // describe('cli instance', ...
}); // describe('haiku.cli', ...
