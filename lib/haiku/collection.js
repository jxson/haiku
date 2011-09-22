var fs = require('fs')
  , path = require("path")
  , _ = require("underscore")
  , Page = require("haiku/page")
  , events = require('events')
  , util = require('util')
;

// # Collection constructor
//
// a collection encapsulates a directory, which each contained
// file or directory being converted into either a content object
// or another collection object, respectively
var Collection = function(options) {
  this.site = options.site; // parent site
  this.parent = options.parent||"root"; // parent collection
  this.path = options.path; // the path of the directory

  // folder is where we keep our contents ... this helps
  // avoid confusion since once of the folder items is called
  // "content" and we also have a class Page. it also prevents
  // content from accidentally overwriting, say, the render method

  // both the site and collection objects have a folder associated
  // with them, and it can be accessed directly, ex:
  // site.folder["content"] or site.folder.templates
  this.folder = {};

  // // for directories, we can just use the basename with no extension
  // // as the name of the directory - this is used in building up
  // // hashes that don't have the full path
  // this.name = path.basename(this.path);

  events.EventEmitter.call(this);

  this.site.logger.debug("creating a new collection for [" + options.path + "]");
};

// `Collection` inherits from `EventEmitter`
util.inherits(Collection, events.EventEmitter);

_.extend(Collection.prototype, {
  // // Might not be needed
  // name: function(){
  //   // for directories, we can just use the basename with no extension
  //   // as the name of the directory - this is used in building up
  //   // hashes that don't have the full path
  //   return path.basename(this.path);
  // },

  // ## collection.basename()
  //
  // Convenience method that wraps path.basename(basename.path) relative to
  // `basename.parent`
  basename: function(){
    return path.basename(this.path);
  },

  // ## collection.read()
  //
  // Asynchronously read the directory and create the content or collection
  // objects accordingly. Emits a `ready` event when done.
  read: function(){
    var collection = this
      , log = this.site.logger
      , collectionPath = path.resolve(collection.path)
      , isReady
    ;

    // Start reading the contents of the directory
    fs.readdir(collectionPath, function(err, list){
      // TODO: emit the error if there are listeners, if there are no
      // listeners throw the error instead
      if (err) throw err;

      log.info('reading directory [' + collection.path + ']');

      // Check to see if all the content/ collection objects are ready by
      // comparing the amount of items in the list from the `fs.readdir` call.
      // the the amount of items in the collection's folder object. Items only
      // get added to the folder after they are done doing their async work
      isReady = function(){
        return list.length === _.size(collection.folder);
      }

      // Loop through each item in the directory
      _.each(list, function(_path){
        var itemPath = path.join(collectionPath, _path)
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
  // Find the content or collection that maps to the passed in `route`
  //
  //     var page = collection.find('/random-page.html');
  //     //=> returns the content object that maps to '/random-page.html'
  //
  //     var posts = collection.find('/posts');
  //     //=> returns the collection object that maps to '/posts'
  //
  find: function(route){
    if (! this._index) this.buildIndex();
    return this._index[route];
  },

  //  // this is the real workhorse behind resolve() and getIndex()
  //  // we'll take it one step at a time
  buildIndex: function() {
    // building the `_index` is easier for pages so split the world up into
    // collections and pages
    var collection = this
      , collections = this.collections()
      , pages = this.pages()
    ;

    collection._index = {};

    // Build up the initial `collection._index` using `collections.pages()`
    _.each(pages, function(page){
      // problem with wrapping templates is that it wont get built and we can't key off template or layout urls
      if (page.path.match(page.site.options.contentDir)){
        collection._index[page.url()] = page;
      } else {
        collection._index[page.name()] = page;
      }
    });

    // Add child collections into the `collection._index`
    _(collections).chain()
      .invoke('buildIndex')
      .each(function(index){
        _.extend(collection._index, index);
      });

    // Allows access for easier iteration when the collection's parent object
    // isn't `'root'`
    return collection._index;
  },
    // return sub-collections of this collection (i.e. excludes pages)
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
    // collections are accessed as a hash; pages as an array
    toJSON: function() {
      return _.extend({}, this.attributes, {
        pages: _(this.pages()).reduce(function(array,page) {
          array.push(page.toJSON()); return array;
        },[]),
        collections: _(this.collections()).reduce(function(hash,collection) {
          hash[collection.name] = collection.toJSON(); return hash;
        },{})
      });
    }
});
//   // get the index for this collection, which is a hash of relative paths
//   // and content/collection objects
//   // ex:  if the folder has a collection named "foo" which in turns contains
//   //      a collection named bar, we could do:
//   //          folder.foo.folder.bar
//   //      but that's tedious. the index will gives us an entry like this:
//   //          { "foo/bar": contentOrCollectionObject }
//   //      for every thing within this collection (and it's collections, etc.)
//   getIndex: function() {
//     return this._index = (this._index||this._buildIndex());
//   },
//
//

//
//
// };

module.exports = Collection;
