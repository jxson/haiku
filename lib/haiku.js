var path = require('path');

require.paths.unshift(path.join(__dirname, '..'));

var Origami = require('haiku/origami')
  , Content = require('haiku/content')
  , fs = require('fs')
  , _ = require('underscore')
  , mkdirp = require('mkdirp')
  , wrench = require('wrench')
;

var Haiku = Origami.extend({
  initialize: function(attributes){
    this._readQueue = [];

    this.content = {};
    this.collections = {};
    this.partials = {};
    this.layouts = {};

    if (attributes.configfile) {
      var config = require(attributes.configfile);

      this.set(config);
    }
  },

  defaults: {
      contentdir: 'content'
    , templatesdir: 'templates'
    , publicdir: 'public'
  },

  // Reads in the source content into the haiku object structure, emits a
  // 'ready' function when the coast is clear
  read: function(){
    // Start over
    this._readQueue = [];
    this.content = {};
    this.collections = {};
    this.partials = {};
    this.layouts = {};

    var haiku = this
      , sourcedir = this.sourcedir()
    ;

    haiku._read(haiku.contentdir(), function(){
      haiku._read(haiku.templatesdir(), function(){
        // loop through all the content and place into the proper collections
        // TODO: refactor
        _.each(haiku.collections, function(keys, collection){
          var objects = [];

          // sorting should happen here
          _.each(keys, function(key){
            objects.push(haiku.content[key].toView())
          });

          var attrs = {};
          attrs[collection] = objects;
          haiku.set(attrs);
        });

        haiku.emit('ready');
      });
    });
  },

  // recursive read takes a path and starts reading in files, knows when it
  // gets a directory and calls it's self
  _read: function(pathname, callback){
    // console.log('reading: '.yellow, pathname);

    var haiku = this
      , content
    ;

    haiku._addToReadQueue(pathname);

    fs.stat(pathname, function(err, stats){
      if (err) throw err;

      if (stats.isDirectory()){
        fs.readdir(pathname, function(err, list){
          if (err) throw err;

          haiku._removeFromReadQueue(pathname);

          _.each(list, function(item){
            var itempath = path.join(pathname, item);
            haiku._read(itempath, callback);
          });
        });

      } else {
        // if (path.extname(pathname) === '.erb'){
        //   console.log('erb!!!'.red, pathname);
        //   // haiku._removeFromReadQueue(pathname, callback);
        //   // return;
        // }

        if (haiku.isInContentDir(pathname)){
          var content = new Content({ file: pathname }, haiku);

          content.on('ready', function(){
            haiku.addContent(this);
            haiku._removeFromReadQueue(pathname, callback);
          });

          content.read();
        }

        if (haiku.isInLayoutsDir(pathname)){
          fs.readFile(pathname, 'utf8', function(err, data){
            var name = path.basename(pathname, '.mustache');

            haiku.layouts[name] = data;
            haiku._removeFromReadQueue(pathname, callback);
          });
        }

        // must come after the check for layouts
        if (haiku.isInPartialsDir(pathname)){
          fs.readFile(pathname, 'utf8', function(err, data){
            var name = path.basename(pathname, '.mustache');

            haiku.partials[name] = data;
            haiku._removeFromReadQueue(pathname, callback);
          });
        }

        if (haiku.isInPublicDir(pathname)){
          haiku._removeFromReadQueue(pathname, callback);
        }
      }
    });
  },

  // Adds content to the haiku.content object, also makes sure to create and
  // add refernces to the proper collection for the piece of content
  addContent: function(content){
    var haiku = this
      , collection
    ;

    // haiku.content.add(content);
    haiku.content[content.url()] = content;

    if (content.isInCollection()) {
      collection = content.get('collection');

      // Append to the preexisting collection
      if (haiku.hasCollection(collection)){
        haiku.collections[collection].push(content.url());
      } else { // create a new collection
        haiku.collections[collection] = [ content.url() ];
      }
    }
  },

  // `hasCollection(collectionName)` checks wether or not the haiku instance
  // has a collection named with the passed in string (`collectionName`).
  //
  // Haiku will automatically add any sub-directory of the `haiku.contentdir`
  // (defaults to 'content') as a collection and map any content objects in
  // that directory to an array defined with the same name as the directory.
  //
  //      haiku.hasCollection('posts'); //=> true
  //      haiku.hasCollection('entries'); //=> false
  //
  // In the above example the Haiku instance has a posts sub-directory of it's
  // content directory. It does not have an entries directory:
  //
  //      haiku.get('posts'); //=> [ [Object], [Object], [Object], ... ]
  //      haiku.get('entries); //=> undefined
  //
  hasCollection: function(collectionName){
    return _(this.collections).chain().keys().include(collectionName).value();
  },

  isInContentDir: function(pathname){
    var contentdir = this.contentdir()
      , found = pathname.indexOf(contentdir) !== -1
    ;

    return found;
  },

  isInLayoutsDir: function(pathname){
    var layoutsdir = path.join(this.templatesdir(), 'layouts')
      , found = pathname.indexOf(layoutsdir) !== -1
    ;

    return found;
  },

  isInPartialsDir: function(pathname){
    var partialsdir = path.join(this.templatesdir())
      , found = pathname.indexOf(partialsdir) !== -1
      , isNotLayout = pathname.indexOf('layout') === -1
    ;

    return found && isNotLayout;
  },

  isInPublicDir: function(pathname){
    var publicdir = this.publicdir()
      , found = pathname.indexOf(publicdir) !== -1
    ;

    return found;
  },

  _addToReadQueue: function(value){
    this._readQueue.push(value);
  },

  _removeFromReadQueue: function(value, callback){
    this._readQueue = _.without(this._readQueue, value);

    if (callback && _.size(this._readQueue) === 0) callback();
  },

  build: function(callback){
    if (!this.builddir()) return;

    var haiku = this;

    mkdirp(haiku.builddir(), 0755, function(err){
      if (err) throw err;

      // copy over the public if it exists
      // TODO: Find a better way to handle this
      wrench.copyDirSyncRecursive(haiku.publicdir(), haiku.builddir());

      _.each(haiku.content, function(page){
        var pathname = path.join(haiku.builddir(), page.buildpath())
          , dirname = path.dirname(pathname)
        ;

        mkdirp(dirname, 0755, function(err){
          if (err) throw err;

          page.render(function(data){
            fs.writeFile(pathname, data, function (err) {
              if (err) throw err;

            });
          });

        });
      });
    });

  },

  // Get the source directory
  sourcedir: function(){
    if (! this.isValid()) return;

    return this.get('source');
  },

  // Returns the full path to the `contentdir`
  contentdir: function(){
    // TODO: warn that the config isn't set up properly
    if (! this.isValid()) return;

    return path.join(this.get('source'), this.get('contentdir'));
  },

  // Returns the full path to the `templatesdir`
  templatesdir: function(){
    // TODO: warn that the config isn't set up properly
    if (! this.isValid()) return;

    return path.join(this.get('source'), this.get('templatesdir'));
  },

  // Returns the full path to the `publicdir`
  publicdir: function(){
    // TODO: warn that the config isn't set up properly
    if (! this.isValid()) return;

    return path.join(this.get('source'), this.get('publicdir'));
  },

  // returns the build directory
  builddir: function(){
    if (! this.get('destination')) return;
    return this.get('destination');
  },

  validate: function(attrs){
    if (!attrs.source){
      this.addError({ source: 'needs to be set' });
    }
  }
});

exports = module.exports = Haiku;
