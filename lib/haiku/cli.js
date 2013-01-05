
var colors = require('colors');

var cli = exports
  , util = require('util')
  , _ = require('underscore')
  , path = require('path')
  , haiku = require('../haiku')
;

cli.help = {
  general: [
    'usage:',
    '  haiku [action] [options]',
    '',
    'actions: ',
    '',
    '  build [options]    # Build the haiku site',
    '  server [options]   # Run the haiku server',
    '  deploy [options]   # Deploy the site!',
    ''
  ].join('\n'),
  build: [
    'usage:',
    '   haiku build [options]',
    '',
    'options: ',
    '   --root PATH         # Path to your haiku\'s root, defaults to the cwd',
    '   --destination PATH  # haiku will build to this directory, defaults to "build"',
    '',
    'description:',
    '   ...',
    '',
    'example:',
    '   ...'
  ].join('\n'),
  server: [
    'usage:',
    '   haiku server [options]',
    '',
    'options: ',
    '   --port PORT     # Defaults to 8080',
    '',
    'description:',
    '   ...',
    '',
    'example:',
    '   ...'
  ].join('\n'),
  deploy: [
    'useage:',
    '   haiku deploy [options]',
    '',
    'options: ',
    '   --source,--root PATH  # Path to your haiku\'s root, defaults to the cwd',
    '   --config,-c PATH      # Path to your haiku config file, defaults to the cwd/config/haiku.js',
    '   --key KEY             # Your s3 api key',
    '   --secret SECRET       # Your s3 secret',
    '   --bucket BUCKET       # The bucket to beam your site to',
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
  return util.puts(cli.help[action]);
};

cli.showErr = function(message){
  return util.puts(message)
}

// we use defineCommand() to give us back a function
// that will do some standard arg processing and
// the run the command, which is passed in as another
// function ... basically so that the comamnd functions
// can just worry about getting the resulting options
// and doing something interesting

cli.defineCommand = function(name, command) {
  cli[name] = function(args) {
    if (args.help) return cli.showHelp(name);

    var options = _.clone(args)
      , source = options.source || process.cwd()
      , config
    ;

    source = path.resolve(process.cwd(), source);

    // Try and read the config if you find one
    try {
      config = require(path.join(source, 'config', 'haiku.js'));
    } catch(e) {
      config = {};
    }

    if (args.config) config = require(path.resolve(source, args.config));

    _.extend(options, config);

    command(options);
  };
}

// the build command ... read the site in and then
// copy it to a destination directory

cli.defineCommand('build', function(options){
  var site = new haiku.Site(options);

  site.on('ready', function(){ site.build(); }).read();
});

// the server command - the server class does all the real work here
// we just create it and call run

cli.defineCommand('server', function(options){
  new haiku.Server.run(options);
});

// // new will create a site template for you when we implement it
// cli.new = cli.defineCommand(function(options) {
//   cli.showErr("This command has not been implemented yet.");
// });

// deploy will push your site to S3 for you
cli.defineCommand('deploy', function(options) {
  var site = new haiku.Site(options);

  site.on('ready', function(){ site.deploy(); }).read();
});

