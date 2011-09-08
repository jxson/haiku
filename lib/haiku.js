var path = require('path');
require.paths.unshift(path.join(__dirname, '..'));


var fs = require("fs")
  , events = require("events")
  , _ = require("underscore")
  , Logger = require("lib/haiku/logger")
  , Collection = require("lib/haiku/collection")
;

var Haiku = function(options) {
  events.EventEmitter.call(this);
  this.directories = options.directories;
  this.logger = new Logger(_.defaults(options.logger,{module:"Haiku"}));
};

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
            throw log.error(path + "must be a directory.");
          }

          // create a new collection using this directory
          var collection = new Collection({context: haiku, path: _path });

          // read the collection, and check to see if we were the last one to
          // finish; if so, fire our ready event
          collection.read(function() {
            log.info("collection " + name + " ready");
            haiku[name] = collection;
            if (isReady()) { haiku.emit("ready"); }
          });
        });
      });
    } catch(err) { haiku.emit("error",err); }
  }
    
};

_.extend(Haiku.prototype,events.EventEmitter.prototype);

module.exports = Haiku;