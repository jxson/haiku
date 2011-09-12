
var colors = require('colors');

var cli = exports
  , sys = require('sys')
  , path = require('path')
  , Haiku = require('haiku')
;

cli.help = {
    general: [
      'usage:',
      '  haiku [action] [options]',
      '',
      'actions: ',
      '  build [options]    # Build the haiku site in --source to --destination',
      ''
    ].join('\n')
  , build: [
      'usage:',
      '   haiku build [options]',
      '',
      'options: ',
      '   --config=PATH       # Path to the haiku config file, defaults to the current working directory',
      '',
      'description:',
      '   ...',
      '',
      'example:',
      '   ...'
    ].join('\n')
  , server: [
      'usage:',
      '   haiku server [options]',
      '',
      'options: ',
      '   --config=PATH       # Path to the haiku config file, defaults to the current working directory',
      '',
      'description:',
      '   ...',
      '',
      'example:',
      '   ...'
    ].join('\n')
}

cli.showHelp = function(action){
  var action = action || 'general';
  return sys.puts(cli.help[action]);
};

cli.showErr = function(message){
  return sys.puts(message)
}

cli.defineCommand = function(command) {
  return function(args) {
    if (args.help || args.h) return cli.showHelp('build');
    var options = require(path.resolve(process.cwd(), args.config))
    ;
    options.logger.module = (options.logger.module||"Haiku");
    command(options);
  }
}
cli.build = cli.defineCommand(function(options){
  
  var site = new Haiku.Site(options.site);

  site.on('ready', function(){
    site.build();
  });

  site.read();
});

cli.server = cli.defineCommand(function(options){
  new Haiku.Server(options).run();
});