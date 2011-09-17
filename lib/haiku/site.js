var fs = require("fs")
  , inherits = require("util").inherits
  , events = require("events")
  , _ = require("underscore")
  , Logger = require("haiku/logger")
  , Collection = require("haiku/collection")
  , path = require('path')
;

var Site = function(options) {
  var options = options || {};

  this.options = _.defaults(options, {
    root: process.cwd(),
    buildDir: 'build',
    contentDir: 'content',
    templatesDir: 'templates',
    publicDir: 'public',
    index: 'index.html',
    loglevel: 'info',
    logger: new Logger({level: (options.loglevel || 'info') })
  });

  // we're an event emitter, so make sure we call it's constructor
  Site.super_.call(this);

  this.title = this.options.title;

  // directories is the list of directories to process
  this.directories = {
    content: path.join(this.options.root, this.options.contentDir),
    templates: path.join(this.options.root, this.options.templatesDir),
    public: path.join(this.options.root, this.options.publicDir)
  };

  // the content object to map to GET /
  this.index = options.index;

  // who do we call to log what's going on
  this.logger = options.logger;

  // folder is where we keep our contents ... this helps
  // avoid confusion since once of the folder items is called
  // "content" and we also have a class Content. it also prevents
  // content from accidentally overwriting, say, the render method

  // both the site and collection objects have a folder associated
  // with them, and it can be accessed directly, ex:
  // site.folder["content"] or site.folder.templates
  this.folder = {};
};

// the index refers to the content we deliver for GET /
// you can set this in options as options.index
Site.default_index = "index.html";


// properly inherit from EventEmitter
inherits(Site,events.EventEmitter);


// define our methods - we'll add them to the prototype below using
// _.extend - just a stylistic thing to avoid having to do
// Site.prototype.method = ... over and over again
var Methods = {

  // read all the content for the site and build an object model
  // for it ...
  read: function() {

    var site = this  // for callbacks

    // what collection objects do we need to build
    ,   collections = _.keys(this.directories)

    // how many are there? helpful for checking to see if we're done
    ,   size = collections.length

    ,   log = this.logger
    ;

    // check to see if all the collections are ready
    // basically, if we have the same number of items in our folder as we
    // do content directories to process, we must be finished, since we
    // don't store them in folders except in our callback
    var isReady = function() { return size == _.keys(site.folder).length; };

    try {

      // okay, here we go ... for each directory that we're passed
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

          // read the collection and when we're done, invoke our callback
          collection.read(function() {
            log.info("collection " + name + " ready");

            // here's where we add it to the folder, so now our isReady
            // function will mark us as finished
            site.folder[name] = collection;

            // if we're the last one to finish, then we want to do some
            // wrap up and emit our "ready" event
            if (isReady()) {

              // first, if we have a separate public directory, we
              // combine it with our actual content; this way you don't
              // have to define separate rewrite rules or anything
              if (site.folder.public) {
                _.extend(site.folder.content.folder,
                      site.folder.public.folder);
                delete site.folder.public;

                // some shortcuts -
                site.content = site.folder.content
                site.templates = site.folder.templates;
                site.layouts = site.templates.folder.layouts;

                // another shortcut, but this one takes some work because
                // we don't want the content objects themselves in here, we
                // want the template data itself. so what we do is iterate
                // through each content object in templates and build up a
                // second hash using the content object's data
                site.partials = _(site.folder.templates.getIndex())
                  .reduce(function(partials,value,key) {
                    partials[key] = value.data;
                    return partials;
                  },{});
              }

              // okay, bookkeeping is finished, and we're in the isReady()
              // callback here, which means we've processed all our content
              // directories. so we're ready as we're ever gonna be
              site.emit("ready");
            }
          });
        });
      });
    } catch(err) { // something went wrong
      site.emit("error",err);
    }
  },

  // a nice convience function that converts GET / into
  // whatever our index path is and then calls resolve() on
  // the content collection, which is where the real work
  // is done ...
  resolve: function(path) {
    if (!path || path == "") { path = this.index; }
    return this.content.resolve(path);
  },
  toJSON: function() {
    return _.extend({ title: this.title }, this.content.toJSON());
  },
  // ask each collection object to build itself
  build: function() {
    this.logger.error("This command has not yet been implemented.");
  }

};

// don't forget to add our methods to the prototype!
_.extend(Site.prototype,Methods);

module.exports = Site;