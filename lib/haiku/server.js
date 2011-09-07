
var express = require('express')
  , _ = require('underscore')
  , Haiku = require('haiku')
  , express = require('express')
  , sys = require('sys')
  , colors = require('colors')
;

var Server = function(attrs){
  var server = this;

  server.haiku = new Haiku({ source: attrs.source });
  server.port = attrs.port;

  server.app = express.createServer();

  server.app.configure('development', function(){
    server.app.use(express.errorHandler({
      dumpExceptions: true, showStack: true
    }));
  });

  server.app.configure(function(){
    server.app.use(express.static(server.haiku.publicdir()));
  });

  server.app.get(/^\/(.*)/, function(req, res){
    var key = '/' + req.params[0]

    server.haiku.once('ready', function(){
      if (key === '/') key = '/index.html';

      console.log('partials:'.yellow.inverse);

      _.each(server.haiku.partials, function(value, k, list){
        var type = typeof value;
        console.log((('  ' + k + ': ').yellow) + type);
      });

      console.log('content:'.yellow.inverse);

      _.each(server.haiku.content, function(value, k, list){
        console.log((('  ' + k + ' ').magenta));
        value.get('content')();
      });

      var content = server.haiku.content[key];

      if (content){
        sys.puts('rendering: ' + content.url());

        content.render(function(err, html){
          if (err) { return res.send(err.message, 503); }

          return res.send(html);
        });
      } else res.send('not found', 404);
    });

    sys.puts('reading: '.yellow + server.haiku.get('source'));

    server.haiku.read();
  });
};

Server.prototype.run = function(){
  var server = this;

  // server.haiku.on('ready', function(){
  //   var message = 'haiku is running! //====>> http://localhost:' + server.port;
  //
  //   sys.puts(message)
  //
  //   console.log('partials:'.yellow.inverse);
  //
  //   _.each(server.haiku.partials, function(value, key, list){
  //     var type = typeof value;
  //     console.log((('  ' + key + ': ').yellow) + type);
  //   });
  //
  //   console.log('content:'.yellow.inverse);
  //
  //   _.each(server.haiku.content, function(value, key, list){
  //     console.log((('  ' + key + ' ').magenta));
  //     value.get('content')();
  //   });
  //
  //   server.app.listen(server.port);
  // });

  // sys.puts('reading: ' + this.haiku.get('source'))
  // sys.puts('...')
  //
  // server.haiku.read();

  var message = 'haiku is running! //====>> http://localhost:' + server.port;
  sys.puts(message)

  server.app.listen(server.port);
};


exports = module.exports = Server;
