var fs = require('fs')
  , path = require("path")
  , _ = require("underscore")
  , Content = require("haiku/content")
;

var Collection = function(options) {
  this.site = options.site;
  this.parent = options.parent||"root";
  this.path = options.path;
  this.folder = {};
  this.site.logger.debug("creating a new collection for [" + options.path + "]");
};

Collection.prototype = {
  read: function(callback) {
    var collection = this
      , log = collection.site.logger
      ;


    fs.readdir(collection.path,function(err,list) {
      if (err) { throw err; }
      log.info("reading contents of directory [" + collection.path + "]");
      
      // we'll use this to check to see if all the
      // directory contents have been read
      var isReady = function() { 
        return list.length == _.keys(collection.folder).length;
      };
      
      _(list).each(function(_path) {
        var fullPath = path.join(collection.path,_path)
          , content
          , options = {
            site: collection.site,
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
            collection.folder[content.name] = content;
            if (isReady()) { 
              collection.name = path.basename(collection.path);
              callback(); 
            }
          });
        });
      }); 
    });
  },
  resolve: function(path) { return this.getIndex()[path]; },
  getIndex: function() {
    return this._index = (this._index||this._buildIndex());
  },
  _buildIndex: function() {
    var collection = this
      , collections = _(collection.folder).select(function(entry,name) { return entry.getIndex; })
      , entries = _(collection.folder).reject(function(entry,name) { return entry.getIndex; })
      , index = _(entries).reduce(function(index,entry) { index[entry.name] = entry; return index; }, {})
    ;
    _(collections).each(function(entry) { 
      _(entry.getIndex()).each(function(value,key) { index[entry.name+"/"+key] = value; }); 
    });
    
    return index;
  }
};

module.exports = Collection;