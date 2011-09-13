var fs = require('fs')
  , path = require("path")
  , _ = require("underscore")
  , Content = require("haiku/content")
;

// a collection encapsulates a directory, which each contained
// file or directory being converted into either a content object
// or another collection object, respectively
var Collection = function(options) {
  this.site = options.site; // parent site
  this.parent = options.parent||"root"; // parent collection
  this.path = options.path; // the path of the directory 
  
  // folder is where we keep our contents ... this helps
  // avoid confusion since once of the folder items is called
  // "content" and we also have a class Content. it also prevents 
  // content from accidentally overwriting, say, the render method
  
  // both the site and collection objects have a folder associated
  // with them, and it can be accessed directly, ex:
  // site.folder["content"] or site.folder.templates
  this.folder = {};
  
  // for directories, we can just use the basename with no extension
  // as the name of the directory - this is used in building up
  // hashes that don't have the full path
  this.name = path.basename(this.path);
  
  this.site.logger.debug("creating a new collection for [" + options.path + "]");
};

Collection.prototype = {

  // read the directory and create the content/collection objects
  read: function(callback) {
    var collection = this // for callbacks
      , log = collection.site.logger
      ;


    // okay, we start by simply reading the contents of the directory
    // asynchronously ... we get a list of the paths within
    fs.readdir(collection.path,function(err,list) {
      if (err) { throw err; }
      log.info("reading contents of directory [" + collection.path + "]");
      
      // check to see if all the content/collections are ready
      // basically, if we have the same number of items in our folder as we 
      // do listing items to process, we must be finished, since we 
      // don't store them in folders except in our callback
      var isReady = function() {
        return list.length == _.keys(collection.folder).length;
      };
      
      // now we just go through each item in the directory ...
      _(list).each(function(_path) {
        var fullPath = path.join(collection.path,_path)
        
          // we refer to whatever we create here, whether it's a 
          // collection object or content object as the "content"
          , content
          
          // this is going to be the same whether or not we create a 
          // content object or collection objects
          , options = {
            site: collection.site,
            parent: collection,
            path: fullPath
          }
          ;
        
        // so let's figure out what this actually is ...
        fs.stat(fullPath, function(err, stats) {
          if (err) { throw err; }
          
          // if it's a directory, create a collection object
          if (stats.isDirectory()) { content = new Collection(options); } 
          
          // otherwise, it must be a file, so it's a content object
          else { content = new Content(options); }

          // okay, tell whatever it is to read itself and then call us
          // back whenever it's done ...
          content.read(function(){ // yay! it finished ...
            log.debug("content processed for [" + _path + "]");
            
            // here's where we add it to the folder, so now our isReady
            // function will mark us as finished
            collection.folder[content.name] = content;
            
            // if we're the last one to finish, then we want to do some
            // wrap up and invoke our caller's callback to let them know
            if (isReady()) { 
              callback(); 
            }
          });
        });
      }); 
    });
  },
  
  // take a path and return the content/collection object associated with it
  resolve: function(path) { return this.getIndex()[path]; },
  
  // get the index for this collection, which is a hash of relative paths
  // and content/collection objects
  // ex:  if the folder has a collection named "foo" which in turns contains
  //      a collection named bar, we could do:
  //          folder.foo.folder.bar
  //      but that's tedious. the index will gives us an entry like this:
  //          { "foo/bar": contentOrCollectionObject }
  //      for every thing within this collection (and it's collections, etc.)
  getIndex: function() {
    return this._index = (this._index||this._buildIndex());
  },
  
  // this is the real workhorse behind resolve() and getIndex()
  // we'll take it one step at a time
  _buildIndex: function() {
    var collection = this // for callbacks
    
      // anything with a getIndex function defined is a collection; probably
      // should encapsulate that or use instanceof but this is an internal
      // function anyway
      , collections = _(collection.folder).select(function(entry,name) {
          return entry.getIndex; })
      
      // the entries are non-collections, that is, everything else; we just
      // use reject instead of select
      , entries = _(collection.folder).reject(function(entry,name) {
          return entry.getIndex; })
      
      // we build up the initial index just using the entries, since they're
      // simple
      , index = _(entries).reduce(function(index,entry) {
          index[entry.name] = entry; return index; }, {})
    ;
    
    // next we have to get the indices for each collection and add them into
    // our index, only with the name of collection prefixed to it; that's how
    // we get "foo/bar" in there
    _(collections).each(function(entry) { 
      _(entry.getIndex()).each(function(value,key) { index[entry.name+"/"+key] = value; }); 
    });
    
    // done! nothing to it ...
    return index;
  },
  toJSON: function() {
    return _.extend({}, 
        _(this.folder).reduce(function(hash,object) { 
          hash[object.name] = object.toJSON(); 
          return hash;
        },{}));
  }
  
};

module.exports = Collection;