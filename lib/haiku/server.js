var express = require('express')
  , path = require('path')
  , _ = require('underscore')
  , Site = require('haiku/site')
  , Logger = require('haiku/logger')
  , mime = require('mime')
;

var Server = function(options){
  var server = this
    , options = options || {}
  ;

  server.options = _.defaults(options, {
    port: 8080,
    host: 'localhost',
    loglevel: 'info'
  });

  // This is for the haiku logger, not to be confused with the express logger
  server.options.logger = new Logger({ level: server.options.loglevel });

  // Get the haiku site ready to go
  server.site = new Site(server.options);

  // Create the express server.
  server.app = express.createServer();

  // The server should use the `express.logger` and the right public dir.
  server.app.configure(function(){
    server.app.use(express.logger('dev'));
    server.app.use(express.static(server.site.directories.public));
  });

  server.app.get(/(.*)/, function(request, response) {
    var site = server.site
      , route = request.params[0]
      , log = server.options.logger
      , contentType = 'text/html'
      , extension = path.extname(route)
    ;

    // Set a ready event on the haiku site object that will only fire once.
    site.once('ready', function(){
      var page = site.find(route);

      if (page){
        // If there is an extension for this route get it's contentType
        if (extension !== '') contentType = mime.lookup(extension);

        response.send(page.render(), { 'Content-Type': contentType });
      } else { // can't find the content :(
        log.error("Can't find content with the route: " + route);
        response.send(404);
      }
    })

    // If there is an error while haiku does it's thing make sure to do the
    // right thing
    site.once('error', function(err){
      log.error(err.message);

      if (err.stack) { log.error(err.stack); }

      response.send(err.message, 503);
    })

    site.read();
  });
};

// the constructor sets everything up, but we still aren't doing anything
// you have to call run() to actually ... well, run the server
Server.prototype.run = function(){
  var host = this.options.host
    , port = this.options.port
    , log = this.options.logger
  ;

  this.app.listen(port, host);

  log.info("Running on " + host + ", port " + port);
};

// this is just a convenience function so you can just call Server.run(options) if you want
Server.run = function(options) { (new Server(options)).run(); }

module.exports = Server;
