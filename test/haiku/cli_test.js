var helper = require('../test_helper')
  , vows = require('vows')
  , assert = require('assert')
  , sinon = require('sinon')
  , cli = require('haiku/cli')
;

vows.describe('haiku/cli').addBatch({
  'commands': {
    topic: cli,
    'server': {
      topic: cli,
      'with no options': 'pending',
      'with the `help` option': function(cli){
        var sys = require('sys');

        sinon.stub(sys, 'puts');

        cli.server({ help: true });

        assert.ok(sys.puts.called);
        assert.equal(sys.puts.args[0], cli.help.server);
      },
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
