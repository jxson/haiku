
// **The Haiku site** provides the main object inside Haiku. It's constructor can take several `options` which are commonly passed from command-line flags or a configuration file (also a command-line flag) when using the `haiku` commands.
//
// run `haiku --help` for more details or view the inline documentation for the cli for more details.

// Require modules.
var fs = require("fs")
  , inherits = require("util").inherits
  , events = require("events")
  , _ = require("underscore")
  , Logger = require("haiku/logger")
  , Collection = require("haiku/collection")
  , path = require('path')
;

// # The Site Class

// ## Site Constructor
//
// The `Site` constructor can take a single `options` argument. `options` is expected to be an object.
var Site = function(options) {
  var options = options || {};

  this.options = _.defaults(options, {
    // `options.root` is the path to the directory where Haiku will be reading
    // from.
    root: process.cwd(),
    // `options.buildDir` is the root relative path to the directory where
    // will Haiku to build to. All compiled html, xml, site assets, etc. will
    // be added to this directory.
    buildDir: 'build',
    // `options.contentDir` is the __root relative__ path to the directory
    // where the Haiku content is, files in the content directory will be
    // read and converted by Haiku into your site's files. All content in this
    // directory must be text!
    contentDir: 'content',
    // `options.templatesDir` is the __root relative__ path to the templates
    // directory, this is where haiku will lookup it's templates and layouts.
    // A piece of content like this:
    //
    //     ---
    //     layout: default
    //     title: Just an example
    //     ---
    //
    //     {{>header}}
    //
    //     some content
    //
    //     {{>footer}}
    //
    // will expect a templates dir that looks like this:
    //
    //     . templates
    //     |-- layouts
    //     |   `-- default.mustache
    //     |-- footer.mustache
    //     `-- header.mustache
    //
    templatesDir: 'templates',
    // `options.publicDir` is the __root relative__ path to the public
    // directory content in this directory will not be read by haiku but
    // instead copied or served directly, this is where you will want to place
    // your site's assets like stylesheets and images
    publicDir: 'public',
    // `options.index` the name of the file for haiku to use when serving
    // routes like `GET /` or `GET /posts/`.
    index: 'index.html',
    // `options.logger` the logger object.
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

  // ## site.find(route)
  //
  // Find the content registered with the `route` argument:
  //
  //    var page = site.find('/about-us.html');
  //
  // For convenience it will convert routes that need to map to an index:
  //
  //     var page = site.find('/');
  //     //=> returns the content for '/index.html'
  //
  //     var page = site.find('/posts');
  //     //=> returns the content for '/posts/index.html'
  //
  find: function(route){
    // translate routes for `GET /` to `GET /index.html` or whatever the
    // `options.index` is set to
    if (!route || route === '' || route === '/') {
      route = '/' + this.options.index;
    }

    // translate routes like `GET /posts/` to `GET /posts/index.html` or
    // whatever the `options.index` is set to
    if (route.match(/\/$/)) route = route + this.options.index;

    return this.content.find(route);
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