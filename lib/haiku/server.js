var express = require('express')
  , Path = require("path")
  , _ = require('underscore')
  , Site = require("haiku/site")
  , Mime = require("mime")
;

var Server = function(options){
  var server = this;
  server.options = options.server;
  server.logger = options.logger
  server.address = options.address;
  server.port = options.port;

  server.app = express.createServer(express.logger());

  server.app.get(/^\/(.*)/, function(request, response) {
      var path = request.params[0]
        , site = new Site(options)
      ;
      site.on("ready", function(){
        try {
          var content = site.resolve(path);
          if (content) {
            var contentType = "text/html";
            var extension = Path.extname(content.name);
            if (extension!="") { contentType = Mime.lookup(extension); }
            response.send(content.render(), {"Content-Type": contentType});
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
  this.app.listen(this.options.port,this.options.address);
  this.logger.info("Running on " + this.options.address + ", port " + this.options.port);
};

Server.run = function(options) { (new Server(options)).run(); }

module.exports = Server;
