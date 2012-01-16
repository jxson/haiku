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
};
