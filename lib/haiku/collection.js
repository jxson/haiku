var fs = require('fs')
  , path = require("path")
  , _ = require("underscore")
  , Utilities = require("lib/haiku/utilities")
  , Content = require("lib/haiku/content")
;

var Collection = function(options) {
  this.context = options.context;
  this.parent = options.parent||"root";
  this.path = options.path;
  this.content = {};
  this.context.logger.debug("creating a new collection for [" + options.path + "]");
};

Collection.prototype = {
  read: function(callback) {
    var collection = this
      , log = collection.context.logger
      ;


    fs.readdir(collection.path,function(err,list) {
      if (err) { throw err; }
      log.info("reading contents of directory [" + collection.path + "]");
      
      // we'll use this to check to see if all the
      // directory contents have been read
      var names = _(list).map(Utilities.getNameFromPath);
      var isReady = function() {
        return _(names).all(function(name) { return collection.content[name]; });
      };
      
      _(list).each(function(_path) {
        var fullPath = path.join(collection.path,_path)
          , content
          , options = {
            context: collection.context,
            parent: collection,
            path: fullPath
          }
          ;
        
        // for each entry in the directory, create
        // a content or collection object ...
        fs.stat(fullPath, function(err, stats) {
          if (err) { throw err; }
          if (stats.isDirectory()) { content = new Collection(options); } 
          else { content = new Content(options); }

          // okay, read the content object and then see if we're the 
          // last one to finish ...
          content.read(function(){
            log.debug("content processed for [" + _path + "]");
            collection.content[content.name] = content;
            if (isReady()) { 
              collection.name = Utilities.getNameFromPath(collection.path);
              callback(); 
            }
          });
        });
      }); 
    });
  }
};

module.exports = Collection;