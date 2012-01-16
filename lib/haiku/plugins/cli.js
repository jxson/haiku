var plugin = exports
  , path = require('path')
  , haiku = require('../index')
  , commander = require('commander')
  , utile = require('utile')
  , _ = require('underscore')
  // , traverse = require('traverse')
;

plugin.name = 'cli';

plugin.attach = function(){
  var app = this
    , packageJSON = require(path.join(haiku.directories.root, 'package.json'))
    , commands = utile.requireDirLazy(haiku.directories.commands)
  ;

  app.commander = commander;

  app.commander.version(packageJSON.version)

  _.each(commands, function(plugin, name){
    app.use(plugin);
  });

  app.on('init', function(){
    // this has to be done here to ensure all plugins are attached and
    // initialized before the cli can do it's actual work
    app.commander.parse(process.argv);

    // The default or missing commands get the help.
    // https://github.com/visionmedia/commander.js/issues/39
    if (app.commander.args.length === 0) {
      process.stdout.write(app.commander.helpInformation());
      app.commander.emit('--help');
      process.exit(0);
    }
  });
};
