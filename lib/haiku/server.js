var express = require('express')
  , Path = require("path")
  , _ = require('underscore')
  , Site = require("haiku/site")
  , Mime = require("mime")
;

var Server = function(options){
  var server = this; // for callbacks
  this.options = options.server;
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
          var content = site.resolve(path);
          
          if (content) { // yep!
            var contentType = "text/html"; // default
            
            // get the extension and then get the MIME type for it
            var extension = Path.extname(content.name);
            if (extension!="") { contentType = Mime.lookup(extension); }
            
            console.log(site.toJSON());
            // send the content with the corresponding Content-Type
            response.send(content.render(), {"Content-Type": contentType});

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
  this.app.listen(this.options.port,this.options.address);
  this.logger.info("Running on " + this.options.address + ", port " + this.options.port);
};

// this is just a convenience function so you can just call Server.run(options) if you want
Server.run = function(options) { (new Server(options)).run(); }

module.exports = Server;