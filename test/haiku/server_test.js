var helper = require('../test_helper')
  , vows = require('vows')
  , assert = require('assert')
  , haiku = require('haiku')
;

vows.describe('haiku.Server').addBatch({
  'new haiku.Server(options)': {
    'with *default* options': 'pending',
    'with the `host` option': 'pending',
    'with the `port` option': 'pending'
  },
  '.run()': 'pending'
}).export(module);
