var fs = require("fs")
  , events = require("events")
  , _ = require("underscore")
  , Logger = require("lib/haiku/logger")
;

var Haiku = function(options) {
  events.EventEmitter.call(this);
  this.directories = options.directories;
  this.index = (options.index||Haiku.default_index);
  this.logger = new Logger(_.defaults(options.logger,{module:"Haiku"}));
};

Haiku.default_index = "index.html";

Haiku.prototype = {
  read: function() {

    var haiku = this
    ,   collections = _.keys(this.directories)
    ,   log = this.logger
    ;

    // check to see if all the collections are ready
    var isReady = function() {
      return _(collections).all(function(name) {return haiku[name];})
    };
    
    try {
      // for each directory, create a collection for it's elements
      _(this.directories).each(function(_path,name) {
        
        log.debug("processing " + name + " directory [" + _path + "]");

        // make sure this is a valid directory ...
        // collections assume you're passing in a valid directory
        fs.stat(_path, function(err, stats) {
          if (err) { throw err; }
          if (!stats.isDirectory()) {
            throw new Error(path + "must be a directory.");
          }

          // create a new collection using this directory
          var Collection = require("lib/haiku/collection")
          var collection = new Collection({context: haiku, path: _path });

          // read the collection, and check to see if we were the last one to
          // finish; if so, fire our ready event
          collection.read(function() {
            log.info("collection " + name + " ready");
            haiku[name] = collection;
            if (isReady()) { 
              if (haiku.public) {
                _.extend(haiku.content.content,haiku.public.content);
                delete haiku.public;
              }
              haiku.emit("ready"); 
            }
          });
        });
      });
    } catch(err) { 
      haiku.emit("error",err); 
    }
  },
  resolve: function(path) {
    if (!path || path == "") { path = this.index; }
    return _(path.split("/")).reduce(function(memo,component) {
      return memo.content[component];
    },this.content);
  }
    
};

_.extend(Haiku.prototype,events.EventEmitter.prototype);

module.exports = Haiku;