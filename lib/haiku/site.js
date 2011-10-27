
// **The Haiku site** provides the main object inside Haiku. It's constructor can take several `options` which are commonly passed from command-line flags or a configuration file (also a command-line flag) when using the `haiku` commands.
//
// run `haiku --help` for more details or view the inline documentation for the cli for more details.

// Require modules.
var fs = require("fs")
  , inherits = require("util").inherits
  , events = require("events")
  , _ = require("underscore")
  , Logger = require('./logger')
  , Collection = require('./collection')
  , Page = require('./page')
  , path = require('path')
  , mkdirp = require('mkdirp')
  , wrench = require('wrench')
  , knox = require('knox')
  , mime = require('mime')
  , crypto = require('crypto')
;

// # The Site Class

// ## Site Constructor
//
// The `Site` constructor can take a single `options` argument. `options` is expected to be an object.
var Site = function(options) {
  var site = this
    , options = options || {}
  ;

  this.options = _.defaults(options, {
    // `options.root` is the path to the directory where Haiku will be reading
    // from.
    root: process.cwd(),
    // `options.baseURL` gets prepended to content urls so you can have haiku
    // build for a site at http://domain.tld/random-directory and all urls
    // will resolve without issue
    baseURL: '/',
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
    configDir: 'config',
    // `options.index` the name of the file for haiku to use when serving
    // routes like `GET /` or `GET /posts/`.
    index: 'index.html',
    // `options.logger` the logger object.
    loglevel: 'info',
    // `options.attributes` allows you to define arbitrary helpers that will
    // be available to the templates. When adding functions the `this` keyword
    // will be scoped to the same site object that the templates access
    // normally. For example, adding this to your config file:
    //
    //     module.exports = {
    //       attributes: {
    //         recent: function(){
    //           return this.collections.posts.pages.slice(0, 2);
    //         }
    //       }
    //     };
    //
    // Will allow you to do this in your templates to grab the top two posts:
    //
    //     {{#site}}
    //       {{#recent}}
    //         {{ title }}
    //       {{/recent}}
    //     {{/site}}
    //
    // Neat.
    attributes: {}
  });

  // we're an event emitter, so make sure we call it's constructor
  Site.super_.call(this);

  // Make sure the `site.options.root` is absolute
  this.options.root = path.resolve(this.options.root);

  // directories is the list of directories to process
  // Maybe make this a wrapped object??
  this.directories = {
    content: path.join(this.options.root, this.options.contentDir),
    templates: path.join(this.options.root, this.options.templatesDir),
    public: path.join(this.options.root, this.options.publicDir),
    layouts: path.join(this.options.root, this.options.templatesDir,
      'layouts'),
    build: path.join(this.options.root, this.options.buildDir),
    config: path.join(this.options.root, this.options.configDir)
  };

  if (options.logger) site.logger = options.logger;
  else site.logger = new Logger({ level: site.options.loglevel });

  // folder is where we keep our contents ... this helps
  // avoid confusion since once of the folder items is called
  // "content" and we also have a class Content. it also prevents
  // content from accidentally overwriting, say, the render method

  // both the site and collection objects have a folder associated
  // with them, and it can be accessed directly, ex:
  // site.folder["content"] or site.folder.templates
  this.folder = {};
};

// properly inherit from EventEmitter
inherits(Site, events.EventEmitter);


// define our methods - we'll add them to the prototype below using
// _.extend - just a stylistic thing to avoid having to do
// Site.prototype.method = ... over and over again
_.extend(Site.prototype, {

  // read all the content for the site and build an object model
  // for it ...
  read: function() {
    var site = this  // for callbacks
      , directories = _({
          content: site.directories.content,
          templates: site.directories.templates
        })
      , log = this.logger
      , isReady
    ;

    // Check to see if all the directories have been read by checking against
    // the size of the `site.folder` object. `Collection` objects for the
    // directories are only added to `site.folder` after doing some async work
    isReady = function() {
      return _.size(directories) === _.keys(site.folder).length;
    };

    directories.each(function(_path, name){
      log.debug('processing "site.directories.' + name + '" //=> ' + _path);

      // Make sure this is a valid directory before making it into a
      // `Collection` object
      fs.stat(_path, function(err, stats){
        if (err){
          log.error([
            'WOAH!'.bold,
            'haiku had a problem reading the "' + name + '" directory. Make',
            'sure the directory exists or that your configuration is correct.'
          ].join('\n'));

          throw err;
        }

        if (! stats.isDirectory) {
          err = new Error(_path + ' must be a directory.');
          throw err;
        }

        // Create a new `Collection` object for this directory
        var collection = new Collection({ 'site': site, path: _path });

        // Read the collection and make sure to emit the 'ready' event on the
        // `site`
        collection.on('ready', function(){
          log.debug('collection "' + name + '" ready');

          // Add the collection to the `site.folder` object, this will allow
          // the private `isReady` do a proper check.
          site.folder[name] = collection;

          // If all the directories have been read wrap it up and emit the
          // ready event
          if (isReady()){
            // Shortcuts
            site.content = site.folder.content;
            // site.templates = site.folder.templates;
            site.layouts = site.folder.templates.folder.layouts;

            // The partials object needs to be a simplified so it is a simple
            // hash with the partial name for the key and the partial's
            // content string as the value like: `{ say_hi: 'Hello!' }`
            site.partials = {};

            _.each(site.folder.templates.index(), function(partial){
              site.partials[partial.name()] = partial.template;
            });

            // site.content.folder
            haikuJSON = site.folder.content.folder['/haiku.json'] = new Page({
              site: site,
              parent: site.folder.content,
              path: path.join(site.directories.content, 'haiku.json')
            });

            var index = site.content.index()
            var json = site.toJSON()

            var blah = {
              templates: _.map(site.partials, function(template, name){
                var content = template;

                content = content
                  .replace(/\{\{\{/g, '%7B%7B%7B')
                  .replace(/\}\}\}/g, '%7D%7D%7D')
                  .replace(/\{\{/g, '%7B%7B')
                  .replace(/\}\}/g, '%7D%7D')

                return { name: name, content: content }
              }),
              content: _.reduce(index, function(memo, page){
                if (page.url() !== '/haiku.json') {

                  memo[page.url()] = page.renderWithoutLayout({ site: json });
                }

                return memo;
              }, {})
            };

            haikuJSON.template = JSON.stringify(blah);

            // Our work is done here.
            site.emit('ready');
          }
        }).read();
      });
    });
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
    var route = route || ''
      , index = this.options.index
      , content = this.content
      , result
    ;

    // translate routes for `GET /` to `GET /index.html` or whatever the
    // `options.index` is set to
    if (route === '' || route === '/') route = '/' + index;

    // translate routes like `GET /posts/` to `GET /posts/index.html` or
    // whatever the `options.index` is set to
    if (route.match(/\/$/)) route = route + index;

    result = content.find(route);

    // A route like `GET /posts` may have slipped by, double check...
    if (! result) result = content.find(route + '/' + index);

    return result;
  },
  toJSON: function() {
    var site = this
      , attributes = site.options.attributes
    ;

    return _.extend(attributes, site.content.toJSON());
  },
  // ask each collection object to build itself
  build: function() {
    var site = this
      , directories = this.directories
      , fileCount = 0
    ;

    mkdirp(directories.build, 0755, function(err){
      if (err) throw err;

      // TODO: Find a better way to handle this
      wrench.copyDirSyncRecursive(directories.public, directories.build);

      _.each(site.content.index(), function(page){
        if (page.attributes.draft) return;

        var _path = path.join(directories.build, page.buildPath())
          , dir = path.dirname(_path)
          , content = page.render()
        ;

        mkdirp(dir, 0755, function(err){
          if (err) throw err;

          fs.writeFile(_path, content, function(err){
            if (err) throw err;

            // Keep track of the number of built pages
            fileCount++;

            // Has everything been built?
            if (fileCount === _.size(site.content.index())) {
              site.emit('build');
            }
          });
        });
      });
    });
  },

  // # site.deploy()
  //
  // Beam the compiled site to s3
  deploy: function(){
    var site = this
      , directories = this.directories
      , log = this.logger
      , deployJSON = {}
      , previosDeploy = {}
      , deployFile = path.join(directories.config, 'deploy.json')
      , tracker = []
      , isReady
      , beam
      , readDeployFile
      , isDeployed
    ;

    isDeployed = function(route){
      return deployJSON[route] === previosDeploy[route];
    };

    isReady = function(){
      return _.size(deployJSON) === tracker.length;
    };

    // Read the file at `_path` and beam it up to s3
    beam = function(_path, stats){
      var destination = _path.replace(directories.build, '')
        , client = knox.createClient({
            key: site.options.key,
            secret: site.options.secret,
            bucket: site.options.bucket
          })
      ;

      // Keep track
      tracker.push(_path);

      var stream = fs.createReadStream(_path)
        , md5sum = crypto.createHash('md5')
        , buffers = []
      ;

      stream.on('data', function(chunk){
        md5sum.update(chunk);
        buffers.push(chunk)
      });

      stream.on('end', function(){
        var digest = md5sum.digest('hex');

        if (previosDeploy[destination] === digest) {
          log.warn('Unchanged: ' + destination);
          deployJSON[destination] = digest;

          if (isReady()) site.emit('deploy');
        } else {
          var req = client.put(destination, {
            'Content-Length': stats.size,
            'Content-Type': mime.lookup(_path)
          });

          req.on('response', function(res){
            if (res.statusCode === 200){
              log.info('deployed: ' + destination + '(' + req.url + ')');

              deployJSON[destination] = digest;

              if (isReady()) {
                site.emit('deploy');
              }
            } else {
              log.error("Couldn't upload: " + destination);
              log.error(res.statusCode);
              log.error(res.headers);

              // allows us to save the deploy file and trigger events
              // normally, the next deploy will try and send this file again
              deployJSON[destination] = false;

              if (isReady()) site.emit('deploy');
            }
          });

          req.on('error', function(err){
            if (err) throw err;
          })

          _.each(buffers, function(chunk){
            req.write(chunk);
          });

          req.end();
        }
      });
    };

    readDirectory = function(name){
      // Keep track!
      tracker.push(name);

      fs.readdir(name, function(err, list){
        if (err) throw err;

        _.each(list, function(item){
          var _path = path.join(name, item);

          fs.stat(_path, function(err, stats){
            if (err) throw err;

            // Stop tracking this directory
            tracker = _.without(tracker, name);

            if (stats.isDirectory()) readDirectory(_path, stats);
            else beam(_path, stats);
          });
        });

        // Stop tracking this directory if the list is empty
        if (list.length === 0) tracker = _.without(tracker, name);
      });
    };

    site.on('build', function(){
      fs.readFile(deployFile, 'utf8', function(err, data){
        previosDeploy = err ? {} : JSON.parse(data);

        readDirectory(directories.build);
      });
    });

    site.on('deploy', function(){
      var content = JSON.stringify(deployJSON);

      mkdirp(directories.config, 0755, function(err){
        fs.writeFile(deployFile, content, 'utf8', function (err) {
          if (err) throw err;

          log.info('DEPLOYED!');
        });
      });
    });

    site.build();
  }
});

module.exports = Site;