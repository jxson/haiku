
var colors = require('colors');

var cli = exports
  , sys = require('sys')
  , path = require('path')
  , Haiku = require('haiku')
;

cli.help = {
    general: [
      'usage:',
      '',
      '  haiku [action] [options]',
      '',
      'actions: ',
      '',
      '  build [options]     # Build the haiku site',
      '',
      '  server [options]    # Run a Web server dynamically serving site content',
      ''
    ].join('\n')
  , build: [
      'usage:',
      '',
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
      '',
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

// we use defineCommand() to give us back a function
// that will do some standard arg processing and
// the run the command, which is passed in as another
// function ... basically so that the comamnd functions
// can just worry about getting the resulting options
// and doing something interesting

cli.defineCommand = function(command) {
  return function(args) {
    if (args.help || args.h) return cli.showHelp('build');
    var options = require(path.resolve(process.cwd(), args.config))
    ;
    options.logger.module = (options.logger.module||"Haiku");
    command(options);
  }
}

// the build command ... read the site in and then
// copy it to a destination directory

cli.build = cli.defineCommand(function(options){
  
  var site = new Haiku.Site(options);

  site.on('ready', function(){
    site.build();
  });

  site.read();
});


// the server command - the server class does all the real work here
// we just create it and call run
cli.server = cli.defineCommand(function(options){
  new Haiku.Server.run(options);
});

// new will create a site template for you when we implement it
cli.new = cli.defineCommand(function(options) {
  cli.showErr("This command has not been implemented yet.");
});

// deploy will push your site to S3 for you
cli.deploy = cli.defineCommand(function(options) {
  cli.showErr("This command has not been implemented yet.");
});

