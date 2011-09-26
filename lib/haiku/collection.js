var fs = require('fs')
  , path = require("path")
  , _ = require("underscore")
  , Page = require("haiku/page")
  , events = require('events')
  , util = require('util')
  , Logger = require("haiku/logger")
;

// # Collection constructor
//
// a collection encapsulates a directory, which each contained
// file or directory being converted into either a content object
// or another collection object, respectively
var Collection = function(options) {
  var options = options || {}
    , collection = this
  ;

  // Default options
  collection.options = _.defaults(options, {
    parent: 'root',
    loglevel: 'info'
  });

  // Set up the logger if one is missing
  if (collection.options.site){
    collection.logger =  collection.options.site.logger
  } else {
    collection.logger = new Logger({ level: collection.options.loglevel })
  }

  // Shortcuts
  collection.site = collection.options.site;
  collection.path = collection.options.path;

  // folder is where we keep our contents ... this helps
  // avoid confusion since once of the folder items is called
  // "content" and we also have a class Page. it also prevents
  // content from accidentally overwriting, say, the render method

  // both the site and collection objects have a folder associated
  // with them, and it can be accessed directly, ex:
  // site.folder["content"] or site.folder.templates
  collection.folder = {};

  events.EventEmitter.call(this);

  collection.logger.debug("creating a new collection for [" +
    collection.options.path + "]");
};

// `Collection` inherits from `EventEmitter`
util.inherits(Collection, events.EventEmitter);

// Less typing of things like `Collection.prototype.foo = function(){ ... }`
_.extend(Collection.prototype, {

  // ## collection.basename()
  //
  // Convenience method that wraps `path.basename(collection.path)`
  basename: function(){
    return path.basename(this.path);
  },

  // ## collection.read()
  //
  // Asynchronously read the directory and create the content or collection
  // objects accordingly. Emits a `ready` event when done.
  read: function(){
    var collection = this
      , log = collection.logger
      , isReady
    ;

    // Start reading the contents of the directory
    fs.readdir(collection.path, function(err, list){
      // TODO: emit the error if there are listeners, if there are no
      // listeners throw the error instead
      if (err) throw err;

      log.debug('reading directory: ' + collection.path);

      // Check to see if all the content/ collection objects are ready by
      // comparing the amount of items in the list from the `fs.readdir` call.
      // the the amount of items in the collection's folder object. Items only
      // get added to the folder after they are done doing their async work
      isReady = function(){
        return list.length === _.size(collection.folder);
      }

      // Loop through each item in the directory
      _.each(list, function(_path){
        var itemPath = path.join(collection.path, _path)
          // Options for the soon to be created collection or content object
          , options = {
              site: collection.site,
              parent: collection,
              path: itemPath
            }
          // The collection or content object
          , item
        ;

        fs.stat(itemPath, function(err, stats){
          // TODO: emit the error if there are listeners, if there are no
          // listeners throw the error instead
          if (err) throw err;

          // if it's a directory, create a collection object
          if (stats.isDirectory()) item = new Collection(options);
          else item = new Page(options);

          // Whatever we are dealing with needs to read itself and let us know
          // when it's done.
          item.on('ready', function(){
            log.debug('content processed for [' + item.path + ']');

            // Add it to the collection's folder, this will make sure the
            // private `isReady` function will properly know what's going on
            collection.folder[item.basename()] = item;

            // If this is the caboose blow the whistle.
            if (isReady()) collection.emit('ready');
          }).read();
        });
      });
    });
  },

  // ## collection.find(route)
  //
  // Find the content that maps to the passed in `route`
  //
  //     var page = collection.find('/random-page.html');
  //     //=> returns the content object that maps to '/random-page.html'
  //
  //     var posts = collection.find('/posts');
  //     //=> returns the collection object that maps to '/posts'
  //
  find: function(route){
    // if (! this._index) this.buildIndex();
    // return this._index[route];

    return this.index(route); // ?
  },

  // Builds the index of all the content to search against. By default returns
  // the `collection._index` object. If a `route` argument is passed in
  // `collection.index` will return the object with the matching key.
  index: function(route){
    // If the index has been built and there is a route return the collection._index object with the key that matches the route
    if (this._index && route) return this._index[route];
    // If the index has been built but there is no route return the whole collection._index object
    if (this._index && !route) return this._index;

    // Otherwise carry on...

    var collection = this
      , collections = _(collection.collections())
      , pages = _(collection.pages())
    ;

    collection._index = {};

    // Build up the index with the pages first
    pages.each(function(page){
      collection._index[page.name()] = page;
    });

    // Then add onto it with the child collections
    collections.chain().invoke('index').each(function(childIndex){
      _.extend(collection._index, childIndex);
    });

    if (route) return collection._index[route];
    else return collection._index;
  },

  // return sub-collections of this collection, excludes pages
  collections: function() {
    return _(this.folder).select(function(entry,name) {
        return entry instanceof Collection;
    });
  },

  // returns page content objects (i.e. excludes collections)
  pages: function() {
    return _(this.folder).select(function(entry,name) {
        return entry instanceof Page;
    });
  },

  // we create a hash with the attributes, pages, and collections
  // collections are accessed as a hash; pages as an array for templates
  // TODO: this feels broken
  toJSON: function() {
    return _.extend({}, this.attributes, {
      pages: _(this.pages()).reduce(function(array,page) {
        array.push(page.toJSON()); return array;
      },[]),
      collections: _(this.collections()).reduce(function(hash,collection) {
        hash[collection.basename()] = collection.toJSON(); return hash;
      },{})
    });
  }
});

module.exports = Collection;
