var path = require('path');

require.paths.unshift(path.join(__dirname, '..'));

var Origami = require('haiku/origami')
  , Configuration = require('haiku/configuration')
  , Collection = require('haiku/collection')
  , Content = require('haiku/content')
  , fs = require('fs')
  , _ = require('underscore')

  , colors = require('colors');
;

var Haiku = Origami.extend({
  initialize: function(configObject){
    if (configObject) {
      if (Haiku.config) Haiku.config.set(configObject);
      else Haiku.configure(configObject);

      // since the attributes would be set to the configs attrs
      this.attributes = {};
    }

    this.config = Haiku.config;
    this.content = new Collection();
    this._readQueue = [];
    this.partials = {};
    this.layouts = {};
  },

  // Reads in the source content into the haiku object structure, emits a
  // 'ready' function when the coast is clear
  read: function(){
    var haiku = this
      , sourcedir = this.config.get('source')
    ;

    haiku._read(sourcedir, function(){
      haiku.emit('ready');
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
        if (haiku.isInContentDir(pathname)){
          var content = new Content({ file: pathname }, haiku);

          content.on('ready', function(){
            haiku.content.add(this);

            if (this.isInCollection()) {
              var collection = this.get('collection');

              // Append to the preexisting collection
              if (haiku.get(collection)){
                haiku.get(collection).push(this.toView())
              } else { // create a new collection
                haiku.attributes[collection] = [];
                haiku.get(collection).push(this.toView())
              }
            }

            haiku._removeFromReadQueue(this.get('file'), callback);
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

  isInContentDir: function(pathname){
    var contentdir = this.config.contentdir()
      , found = pathname.indexOf(contentdir) !== -1
    ;

    return found;
  },

  isInLayoutsDir: function(pathname){
    var layoutsdir = path.join(this.config.templatesdir(), 'layouts')
      , found = pathname.indexOf(layoutsdir) !== -1
    ;

    return found;
  },

  isInPartialsDir: function(pathname){
    var partialsdir = path.join(this.config.templatesdir())
      , found = pathname.indexOf(partialsdir) !== -1
      , isNotLayout = pathname.indexOf('layout') === -1
    ;

    return found && isNotLayout;
  },

  isInPublicDir: function(pathname){
    var publicdir = this.config.publicdir()
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
  }
});

Haiku.configure = function(configObject){
  Haiku.config = Haiku.config || new Configuration(configObject);
};

exports = module.exports = Haiku;
