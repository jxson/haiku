// var EE = require('events').EventEmitter
//   , otimist = require('optimist')
//   , command = new EE()
//   , _ = require('underscore')
//   , Target
// ;
//
// Target = function(){
//   // body...
// };
//
// Target.prototype.deploy = function(dir, callback){
//   callback(null);
// };
//
// command.actions = {};
//
// command.runner = function(){
//   var argv = otimist
//       .boolean('help')
//       .alias('h', 'help')
//       .argv
//   ;
//
//   // get the list of deploy targets from the config
//
//   config = {}
//
//   config.targets = {
//     default: {
//       strategy: 's3',
//       key: 'fvdg',
//       secret: 'vzfvdatbdybhsfybh',
//       bucket: 'foo.com'
//     },
//     staging: {
//       strategy: 's3',
//       key: 'fvdg',
//       secret: 'vzfvdatbdybhsfybh',
//       bucket: 'staging.foo.com'
//     }
//   }
//
//   _.each(config.targets, function(options, name){
//     console.log(name, options);
//
//     var target = new Target(options)
//     ;
//
//     var action = new EE();
//
//     action.runner = function(){
//       target.deploy('build', function(err){
//         console.log('deployed')
//       });
//     }
//
//     command.actions[name] = action;
//   });
//
//   if (argv.help) return command.emit('--help');
//
//   console.log('argv', argv._[1]);
//   console.log('command.actions', command.actions);
//
//   // show the help as the default action when there are targets
//   // walk through configuration if there are no targets
//
//   if (command.actions[argv._[1]]) {
//     command.actions[argv._[1]].runner();
//   }
// };
//
// command.on('--help', function(){
//   console.log('deploy help');
// });
//
// module.exports = command;

module.exports = function(cli){
  // find the deploy commands and hook them

  cli.on('deploy', function(){
    console.log('deploy!!!!!');
  });

  cli.on('deploy --help', function(){
    console.log('do it like this...');
  });

  cli.on('deploy *', function(){

  });
}
