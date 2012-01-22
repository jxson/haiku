var EE = require('events').EventEmitter
  , otimist = require('optimist')
  , command = new EE()
;

command.runner = function(){
  var argv = otimist
      .boolean('help')
      .alias('h', 'help')
      .argv
  ;

  if (argv.help) return command.emit('--help');
};

command.on('--help', function(){
  console.log('deploy help');
});

module.exports = command;
