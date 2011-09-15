var helper = require('../test_helper')
  , vows = require('vows')
  , assert = require('assert')
  , cli = require('haiku/cli')
;

vows.describe('haiku/cli').addBatch({
  'commands': {
    topic: cli,
    'server': {
      'with no options': 'pending',
      'with the `help` option': 'pending',
      'with the `config` option': 'pending'
    },
    'build': {
      'with no options': 'pending',
      'with the `help` option': 'pending',
      'with the `config` option': 'pending'
    },
    'new': 'pending',
    'deploy': 'pending'
  }
}).export(module);
