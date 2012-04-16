var assert = require('assert')
  , cli = require('../../lib/haiku/cli')
  , path = require('path')
  , instance
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
    beforeEach(function(){
      instance = new cli.CLI();
    });

    it('should return the cli instance ', function(){
      assert.equal(instance.option({ flag: 'foo' })
      , instance
      , 'does NOT return the CLI instance');
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
    }); // describe('with valid params', ...

    describe('without params', function(){
      it('should throw an invalid arguments error', function(){
        assert.throws(function(){
          instance.option();
        }, /invalid arguments for cli.option()/);
      });
    }); // describe('without params', ...
  }); // describe('.option(params)', ...

  describe('.command(route)', function(){
    it('should return the cli instance ', function(){
      assert.equal(cli.command('foo')
      , cli
      , 'does NOT return the CLI instance');
    });

    it('adds to .routes_ object', function(){
      cli.command('foo');

      assert.ok(cli.routes_.foo, 'route wasn\'t added');
    });

    it('should turn a string path into a regular expression', function(){
      cli.command('bar');

      assert.equal(/bar/.constructor, RegExp);
      assert.ok(false)
    });

    // it('should match dots in paths ', function(){
    //
    // });
    //
    // it('should throw if the route isn\'t a string or regex', function(){
    //
    // });
    //
    // describe('regex routes', function(){
    //   it('should allow regex route', function(){
    //
    //   });
    //
    //   it('should make regex captures available', function(){
    //
    //   });
    // }); // describe('regex routes', ...
    //
    // describe('named params', function(){
    //   it('should expose named params', function(){
    //
    //   });
    //
    //   it('should match dots (.) as part of a named param', function(){
    //
    //   });
    //
    //   it('should match a dot (.) outside of a named param', function(){
    //
    //   });
    // }); // describe('named params', ...
    //
    // describe('splats', function(){
    //   it('should support single splats', function(){
    //
    //   });
    //
    //   it('should support multiple splats', function(){
    //
    //   });
    //
    //   it('should support mixing named params and splats', function(){
    //
    //   });
    // }); // describe('splats', ...
  }); // describe('.command(route)', ...
}); // describe('cli', ...
