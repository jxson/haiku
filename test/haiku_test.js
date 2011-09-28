var vows = require('vows')
  , assert = require('assert')
  , haiku = require('../lib/haiku')
;

vows.describe('haiku').addBatch({
  'exports': {
    topic: haiku,
    'should include the `Site` constructor': function(haiku){
      assert.isFunction(haiku.Site);
    },
    'should include the `Server` constructor': function(haiku){
      assert.isFunction(haiku.Server);
    }
  }
}).export(module);
