
var express = require('express')
  , _ = require('underscore')
  , Haiku = require('haiku')
  , express = require('express')
  , sys = require('sys')
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

  server.app.get('/', function(req, res){

    index = server.haiku.content['/index.html'];

    if (index){
      index.render(function(html){
        res.send(html);
      });
    } else {
      res.send('not found', 404)
    }
  });


  server.app.get(/^\/(.*)/, function(req, res){
    var key = '/' + req.params[0]
        content = server.haiku.content[key];
    ;

    if (content){
      content.render(function(html){
        res.send(html);
      });
    } else {
      res.send('not found', 404);
    }
  });
};

Server.prototype.run = function(){
  var server = this;

  server.haiku.on('ready', function(){
    var message = 'haiku is running! //====>> http://localhost:' + server.port;
    sys.puts(message)
    server.app.listen(server.port);
  });

  sys.puts('reading: ' + this.haiku.get('source'))
  sys.puts('...')

  server.haiku.read();
};


exports = module.exports = Server;
