var express = require('express')
  , _ = require('underscore')
  , Site = require("lib/haiku/site")
  , Logger = require("lib/haiku/logger")
;

var Server = function(options){
  var server = this;
  server.options = options;
  server.logger = new Logger(_.defaults(options.logger,{module:"Haiku"}));
  server.options.haiku.logger = server.logger;

  server.address = options.address;
  server.port = options.port;

  server.app = express.createServer(express.logger());

  server.app.get(/^\/(.*)/, function(request, response) {
      var path = request.params[0]
        , site = new Site(server.options.haiku)
      ;
      site.on("ready", function(){
        try {
          var content = site.resolve(path);
          if (content) {
            response.send(content.render());
          } else { 
            server.logger.error("Can't find content for [" + path + "]");
            response.send(404); }
        } catch(err) {
          server.logger.error(err.message);
          if (err.stack) { server.logger.error(err.stack); }
          response.send(err.message,503);
        }
      });
      site.on("error", function(err) {
        server.logger.error(err.message);
        response.send(err.message,503);
      });
      site.read();
  });
};

Server.prototype.run = function(){
  this.app.listen(this.port,this.address);
  this.logger.info("Running on " + this.address + ", port " + this.port);
};

Server.run = function(options) {
  (new Server(options)).run();
}

module.exports = Server;
