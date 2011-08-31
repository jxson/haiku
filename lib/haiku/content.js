// var
//   , fs = require('fs')
//   , mkdirp = require('mkdirp')
// ;

var Origami = require('haiku/origami')
  , fs = require('fs')
  , yaml = require('yaml')
  , path = require('path')
  , _ = require('underscore')
  , Mustache = require('mustache')

  , colors = require('colors')
;

var Content = Origami.extend({
  initialize: function(attributes, haiku){
    if (haiku) this.haiku = haiku;
  },

  defaults: {
    layout: 'default',
    publish: true
  },

  read: function(){
    this.extractAttributesFromFile(function(err, content){
      content.emit('ready');
    });
  },

  extractAttributesFromFile: function(callback){
    // http://stackoverflow.com/q/1068308
    var regex = /^(\s*---([\s\S]+)---\s*)/gi
      , content = this
      , callback = callback;
    ;

    fs.readFile(this.get('file'), 'utf8', function(err, data){
      if (err) throw err;

      var match = regex.exec(data);

      if (match.length > 0){
        var yamlString = match[2].replace(/^\s+|\s+$/g, '')
          , template = data.replace(match[0], '')
          , yamlAttributes
        ;

        attributes = yaml.eval(yamlString);
        content._template = template;

        content.set(attributes);

        callback(null, content);
      } else {
        var message = "Haiku can't read the file: \n  " + content.get('file')
          , err = new Error(message);
        ;

        callback(err, content);
      }
    });
  },

  parser: function(){
    if (!this.get('file')) return;

    var extname = path.extname(this.get('file'))
      , markdownExtensions = ['.md', '.markdown', '.mdown', '.mkdn', '.mkd']
      , htmlExtensions = ['.mustache', '.html']
    ;

    if (_.include(markdownExtensions, extname)){
      return 'markdown';
    }

    if (extname === '.textile'){
      return 'textile';
    }

    if (_.include(htmlExtensions, extname)){
      return undefined;
    }
  },

  url: function(){
    if (! this.get('file')) return;

    var pathname = this.get('file').replace(/(.*)\/content\//g, '')
        originalExtension = path.extname(this.get('file'))
        url = pathname.replace(originalExtension, this._extension())
    ;

    return url;
  },

  _extension: function(){
    if (! this.get('file')) return;

    var basename = path.basename(this.get('file'))
      , prextArray = basename.split('.')
    ;

    if (prextArray.length > 2){
      prext = prextArray[prextArray.length - 2]
    } else {
      prext = 'html'
    }

    return '.' + prext;
  },

  // this should become async
  render: function(callback){
    var layouts = this.haiku.layouts
      , content = this
      , partials = content.haiku.partials
      , layout = layouts[content.get('layout')]
      , template = content._template
    ;

    view = content.haiku.toView({
      yield: function(){
        return Mustache.to_html(template, content.toView(), partials);
      }
    });

    var html = Mustache.to_html(layout, view, partials);

    callback(html);
  },

  isInCollection: function(){
    this._getCollectionFromFile();

    if (this.get('collection')) return true;
    else return false;
  },

  collection: function(){
    return this._getCollectionFromFile();
  },

  _getCollectionFromFile: function(){
    var file = this.get('file')
      , contentdir = this.haiku.config.contentdir()
      , relativepath = file.replace(contentdir, '')
      , basename = path.basename(file)
      , directories = relativepath.split('/')
      , collection = ''
    ;

    _(directories)
      .chain()
      .compact()
      .without(basename)
      .each(function(dir){
        if (collection.length === 0) collection += dir
        else collection += ('_' + dir)
      });

    if (collection.length === 0) return;

    this.set({ collection: collection });

    return collection;
  }
});

exports = module.exports = Content;
