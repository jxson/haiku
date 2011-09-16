var express = require('express')
  , Path = require("path")
  , _ = require('underscore')
  , Site = require("haiku/site")
  , Logger = require("haiku/logger")
  , Mime = require("mime")
;

var Server = function(options){
  var server = this
    , options = options || {}
  ;

  server.options = _.defaults(options, {
    port: 8080,
    host: 'localhost',
    loglevel: 'info',
    logger: new Logger({level: (options.loglevel || 'info') })
  });

  this.logger = options.logger; // easier to type :)

  // create an express server with logging turned on
  server.app = express.createServer(express.logger());

  // basically, handle any GET request
  server.app.get(/^\/(.*)/, function(request, response) {
      var path = request.params[0]

        // we create a brand new Site every time so
        // we pick up any changes you made
        , site = new Site(options)
      ;

      // once we've read everything in ...
      site.on("ready", function(){
        try {

          // see if we can find the content you requested
          var page = site.resolve(path);

          if (page) { // yep!
            var contentType = "text/html"; // default

            // get the extension and then get the MIME type for it
            var extension = Path.extname(page.name);
            if (extension!="") { contentType = Mime.lookup(extension); }

            // send the content with the corresponding Content-Type
            response.send(page.render(), {"Content-Type": contentType});

          } else { // can't find the content :(
            server.logger.error("Can't find content for [" + path + "]");
            response.send(404); }

        } catch(err) { // we hope to never get here!
          server.logger.error(err.message);
          if (err.stack) { server.logger.error(err.stack); }
          response.send(err.message,503);
        }
      });

      // we have both the exception handler (above) AND the error event
      // because if the site generates an error we get the event,
      // but sometimes other things just throw ...
      site.on("error", function(err) {
        server.logger.error(err.message);
        response.send(err.message,503);
      });

      // all we've done so far is set up the "ready" event
      // we still have to process the content
      site.read();
  });
};

// the constructor sets everything up, but we still aren't doing anything
// you have to call run() to actually ... well, run the server
Server.prototype.run = function(){
  var host = this.options.host
    , port = this.options.port
  ;

  this.app.listen(port, host);
  this.logger.info("Running on " + host + ", port " + port);
};

// this is just a convenience function so you can just call Server.run(options) if you want
Server.run = function(options) { (new Server(options)).run(); }

module.exports = Server;
