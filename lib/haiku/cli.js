var CLI
  , EE = require('events').EventEmitter
  , inherits = require('inherits')
  , optimist = require('optimist')
;

CLI = function(options){
  var cli = this
    , options = options || {}
  ;

  cli.aliases = {};
  cli.version = options.version;
  cli.help = options.help;

  if (cli.help) {
    cli.on('--help', function(){
      console.log(cli.help);
    });
  }

  if (cli.version) {
    cli.on('--version', function(){
      console.log(cli.version);
    });
  }

  Object.defineProperty(cli, 'argv', {
    get: function(){
      return argv = optimist
        .alias(cli.aliases)
        .alias('h', 'help')
        .alias('v', 'version')
        .boolean('help')
        .boolean('version')
        .argv
      ;
    }
  });

  Object.defineProperty(cli, 'route', {
    get: function(){
      return cli.argv._.join(' ');
    }
  });

  EE.call(cli);
};

inherits(CLI, EE);

CLI.prototype.alias = function(key, alias){
  this.aliases[key] = alias;
};

CLI.prototype.start = function(){
  var cli = this
  ;

  if (!cli.route.length) {
    if (cli.argv.help) return cli.emit('--help');
    if (cli.argv.version) return cli.emit('--version');
  } else {
    return cli.emit(cli.route, cli.argv);
  }
};

module.exports = function(options, hook){
  var cli = new CLI(options)
  ;

  hook(cli);

  cli.start();
};

module.exports.CLI = CLI;
