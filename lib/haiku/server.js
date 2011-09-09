var express = require('express')
  , _ = require('underscore')
  , Haiku = require('lib/haiku')
;

var Server = function(options){
  var server = this;
  server.haiku_options = options.haiku;

  server.address = options.address;
  server.port = options.port;

  server.app = express.createServer(express.logger());

  server.app.get(/^\/(.*)/, function(request, response) {
    try {
      var path = request.params[0]
        , haiku = new Haiku(server.haiku_options)
      ;
      haiku.on("ready", function(){
        var content = haiku.resolve(path);
        if (content) {
          response.send(content.render());
        } else { response.send(404); }
      });
      haiku.on("error", function() {
        response.send(err.message,503);
      });
      haiku.read();
    } catch(err) {
      console.log(err);
      response.send(err.message,503);
    }
  });
};

Server.prototype.run = function(){
  this.app.listen(this.port,this.address);
  console.log("Haiku is running on " + this.address + ", port " + this.port);
};

Server.run = function(options) {
  (new Server(options)).run();
}

module.exports = Server;
