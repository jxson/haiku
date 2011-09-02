
var colors = require('colors');

var cli = exports
  , sys = require('sys')
  , path = require('path')
  , Haiku = require('haiku')
  , Server = require('haiku/server')
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
      '   --source=PATH       # Path to the haiku source, defaults to the current working directory',
      '   --destination=PATH  # Path where the compiled source should be put, defaults to "build"',
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
      '   --port=PORT     # Defaults to 8080',
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

cli.build = function(args){
  if (args.help || args.h) return cli.showHelp('build');

  var source = path.resolve(process.cwd(), args.source)
    , destination = path.resolve(process.cwd(), args.destination)
  ;

  if (source === destination){
    var message = [
      'You are trying to build your haiku to the same dir as the source, which could ruin your day:',
      '',
      '   --source "' + source + '"',
      '   --destination "' + destination + '"',
      '',
      'Try again with different options or run this for help:',
      '   haiku build --help',
      ''
    ].join('\n');

    return  cli.showErr(message);
  }

  // TODO check that the source is real

  var haiku = new Haiku({
    source: source,
    destination: destination
  });

  haiku.on('ready', function(){
    haiku.build();
  });

  haiku.read();
};

cli.server = function(args){
  if (args.help || args.h) return cli.showHelp('server');

  var source = path.resolve(process.cwd(), args.source)
    , port = args.port
    , server = new Server({ source: source, port: port });
  ;

  console.log('args'.magenta, args);

  server.run();
};
