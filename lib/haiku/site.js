var fs = require("fs")
  , events = require("events")
  , _ = require("underscore")
  , Collection = require("lib/haiku/collection")
;

var Site = function(options) {
  events.EventEmitter.call(this);
  this.directories = options.directories;
  this.index = (options.index||Site.default_index);
  this.logger = options.logger;
  this.folder = {};
};

Site.default_index = "index.html";

Site.prototype = {
  read: function() {

    var site = this
    ,   collections = _.keys(this.directories)
    ,   size = collections.length
    ,   log = this.logger
    ;

    // check to see if all the collections are ready
    var isReady = function() { return size == _.keys(site.folder).length; };
    
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
          var collection = new Collection({"site": site, path: _path });

          // read the collection, and check to see if we were the last one to
          // finish; if so, fire our ready event
          collection.read(function() {
            log.info("collection " + name + " ready");
            site.folder[name] = collection;
            if (isReady()) { 
              if (site.folder.public) {
                _.extend(site.folder.content.folder,
                      site.folder.public.folder);
                delete site.folder.public;
                site.templates = site.folder.templates;
                site.layouts = site.templates.folder.layouts;
                site.partials = _(site.folder.templates.getIndex())
                  .reduce(function(partials,value,key) {
                    partials[key] = value.data;
                    return partials;
                  });
              }
              site.emit("ready"); 
            }
          });
        });
      });
    } catch(err) { 
      site.emit("error",err); 
    }
  },
  resolve: function(path) {
    if (!path || path == "") { path = this.index; }
    return this.folder.content.resolve(path);
  }
    
};

_.extend(Site.prototype,events.EventEmitter.prototype);

module.exports = Site;