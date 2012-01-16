var plugin = module.exports
;

plugin.name = 'build command';

plugin.attach = function(){
  var app = this
    , commander = app.commander
  ;

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
