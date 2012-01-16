var plugin = exports
  , path = require('path')
  , commander = require('commander')
  , utile = require('utile')
  , _ = require('underscore')
  // , traverse = require('traverse')
;

plugin.name = 'cli';

plugin.attach = function(){
  var app = this
    , packageJSON = require(path.join(app.directories.root, 'package.json'))
    , commands = utile.requireDirLazy(app.directories.commands)
  ;

  app.cli = commander;

  app.cli.version(packageJSON.version)

  _.each(commands, function(command, name){
    command(app.cli);
  });

  app.on('init', function(){
    // this has to be done here to ensure all plugins are attached and
    // initialized before the cli can do it's actual work
    app.cli.parse(process.argv);

    // The default or missing commands get the help.
    // https://github.com/visionmedia/commander.js/issues/39
    if (app.cli.args.length === 0 || !commands[app.cli.args[0]]) {
      process.stdout.write(app.cli.helpInformation());
      app.cli.emit('--help');
      process.exit(0);
    }
  });
};
