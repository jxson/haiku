var fs = require('fs')
  , _ = require("underscore")
  , Utilities = require("lib/haiku/utilities")
;

var Content = function(options) {
  this.context = options.context;
  this.parent = options.parent||"root";
  this.path = options.path;
  this.content = "";
  this.context.logger.debug("creating a new content object for [" + options.path + "]");
};

Content.prototype = {
  read: function(callback) {
    var content = this
      , log = content.context.logger
      ;
      
    log.info("reading contents of file [" + content.path + "]");
    fs.readFile(content.path, 'utf8', function(err, data) {
      if (err) { throw err; }
      content.content = data;
      content.name = Utilities.getNameFromPath(content.path);
      callback();
    });
  }
}

module.exports = Content;