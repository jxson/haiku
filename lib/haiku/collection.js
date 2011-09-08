var path = require('path');
require.paths.unshift(path.join(__dirname, '..'));


var fs = require('fs')
  , _ = require("underscore")
  , Content = require('lib/haiku/content')
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
      var isReady = function() {
        return _(list).all(function(_path) { return collection.content[_path]; });
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
            collection.content[_path] = content;
            if (isReady()) { log.debug("content is ready for "+collection.path); callback(); }
          });
        });
      }); 
    });
  }
};

module.exports = Collection;