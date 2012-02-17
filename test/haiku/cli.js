var assert = require('assert')
  , haiku = require('../../lib/haiku')
;

describe('haiku.cli', function(){
  it('should be a function', function(){
    assert.equal(typeof haiku.cli, 'function');
  });

  it('should have a CLI class constructor', function(){
    assert.equal(typeof haiku.cli.CLI, 'function');
    assert.ok(new(haiku.cli.CLI) instanceof CLI);
  });
}); // describe('haiku.cli', ...
