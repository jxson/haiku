var path = require('path')
  , optimist = require('optimist')
  , inherits = require('inherits')
  , EE = require('events').EventEmitter
  , _ = require('underscore')
  , utile = require('utile')
  , haiku = require('./index')
;

var CLI = function(){
  var cli = this
  ;

  this.__defineGetter__('action', function() {
    return optimist.argv._[0];
  });

  this.commands = utile.requireDirLazy(haiku.directories.commands);
};

inherits(CLI, EE);

CLI.prototype.start = function(){
  var cli = this
      argv = optimist
      .alias('v', 'version')
      .alias('h', 'help')
      .boolean('help')
      .argv
  ;

  _.each(cli.commands, function(command, action){
    cli.on(action, command.runner);
  });

  if (cli.commands[cli.action]) {
    return cli.emit(cli.action);
  } else {
    if (argv.help) return cli.emit('--help');
    if (argv.version) return cli.emit('--version');
    return cli.emit('--help');
  }
};

module.exports = new CLI();
