// var vows = require('vows')
//   , assert = require('assert')
//   , path = require('path')
//   , sinon = require('sinon')
//   , _ = require('underscore')
//   , haiku = require('../../lib/haiku')
//   , cli = require('../../lib/haiku/cli')
// ;
//
// vows.describe('haiku/cli').addBatch({
//   'commands': {
//     topic: cli,
//     'server': {
//       'with no options': sinon.test(function(cli){
//         this.stub(haiku.Server, 'run');
//
//         cli.server({});
//
//         assert.ok(haiku.Server.run.called);
//         assert.isObject(haiku.Server.run.args[0][0]);
//       }),
//       'with the `help` option': sinon.test(function(cli){
//         var sys = require('sys');
//
//         this.stub(sys, 'puts');
//
//         cli.server({ help: true });
//
//         assert.ok(sys.puts.called);
//         assert.equal(sys.puts.args[0], cli.help.server);
//       }),
//       'with the `config` option': sinon.test(function(cli){
//         this.stub(haiku.Server, 'run');
//
//         var root = path.resolve(path.join('examples', 'configfile'))
//           , configFile = path.join(root, 'haiku_config')
//           , config = require(configFile)
//           , stub = haiku.Server.run
//         ;
//
//         cli.server({ config: configFile });
//
//         assert.ok(stub.called);
//
//         _.each(config, function(option, key){
//           assert.include(stub.args[0][0], key);
//           assert.equal(stub.args[0][0][key], option);
//         });
//       })
//     },
//     'build': {
//       'with no options': 'pending',
//       'with the `help` option': 'pending',
//       'with the `config` option': 'pending'
//     },
//     'new': 'pending',
//     'deploy': 'pending'
//   }
// }).export(module);