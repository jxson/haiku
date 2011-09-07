
var express = require('express')
  , _ = require('underscore')
  , Haiku = require('haiku')
  , express = require('express')
  , sys = require('sys')
  , colors = require('colors')
;

var Server = function(attrs){
  var server = this;

  server.source = attrs.source;

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
    var key = '/' + req.params[0];

    server.haiku.once('ready', function(){
      if (key === '/') key = '/index.html';

      var content = this.content[key];

      // temporary debug
      // TODO: make a configurable logger
      console.log('partials: \n'.magenta, _.keys(server.haiku.partials));
      console.log('content: \n'.magenta, _.keys(server.haiku.content));
      console.log('collections: \n'.magenta, _.keys(server.haiku.collections));

      if (content){
        sys.puts('rendering: '.green + content.url());

        content.render(function(err, html){
          if (err) return res.send(err.message, 503);

          res.send(html);
        });
      }
      else res.send('not found', 404);
    });

    sys.puts('reading: '.yellow + server.haiku.get('source'));

    server.haiku.read();
  });
};

Server.prototype.run = function(){
  var server = this
    , message = 'haiku is running! //====>> http://localhost:' + server.port
  ;

  sys.puts(message)

  server.app.listen(server.port);
};


exports = module.exports = Server;
