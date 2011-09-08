// var
//   , mkdirp = require('mkdirp')
// ;

var Origami = require('haiku/origami')
  , fs = require('fs')
  , yaml = require('yaml')
  , path = require('path')
  , _ = require('underscore')
  , Mustache = require('mustache')
  , markdown = require('marked')
  , textile = require('stextile')

  , colors = require('colors')
;

var Content = Origami.extend({
  initialize: function(attributes, haiku){
    var c = this;

    if (haiku) this.haiku = haiku;

    var helpers = {
      content: function(){
        var view = c.toView({ site: c.haiku.toView() })
          , partials = c.haiku.partials
        ;

        // TODO: needs a try catch with a meaningful err
        try {
          return Mustache.to_html(c._template, view, partials);
        } catch(err) {
          var newErr = new Error([
                'MUSTACHE ERROR :{',
                '   ' + c.get('file'),
                '',
                ' Template:',
                c._template
              ].join('\n'));
        }

      },

      url: c.url()
    };

    c.set(helpers);
  },

  defaults: {
    layout: 'default',
    publish: true
  },

  read: function(){
    var content = this;

    this.extractAttributesFromFile(function(err){
      if (err) throw err;

      content.emit('ready');
    });
  },

  extractAttributesFromFile: function(callback){
    // http://stackoverflow.com/q/1068308
    var regex = /^(\s*---([\s\S]+)---\s*)/gi
      , content = this
      , file = this.get('file')
    ;

    fs.readFile(file, 'utf8', function(err, data){
      if (err) throw err;

      var match = regex.exec(data);

      if (match && match.length > 0){
        var yamlString = match[2].replace(/^\s+|\s+$/g, '')
          , template = data.replace(match[0], '')
          , yamlAttributes
        ;

        attributes = yaml.eval(yamlString);

        content._template = content.parse(template);

        content.set(attributes);

        callback();
      } else {
        content._template = content.parse(data);
        callback();
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

  parse: function(content){
    var parser = this.parser();

    if (parser === 'markdown') return markdown(content);
    if (parser === 'textile') return textile(content)

    return content;
  },

  url: function(){
    if (! this.get('file')) return;

    // TODO: this should allow a configurable prefix
    return '/' + this.buildpath();
  },

  buildpath: function(){
    if (! this.get('file')) return;

    var pathname = this.get('file').replace(/(.*)\/content\//g, '')
        basename = path.basename(pathname)
        dots = _.without(basename.split('.'), 'mustache')
        extension = 'html'
    ;

    // No extension? defaults to .html
    if (dots.length === 1) dots.push(extension);

    newBasename = dots.join('.');

    return pathname.replace(basename, newBasename);
  },

  // this should become async
  render: function(callback){
    var layouts = this.haiku.layouts
      , content = this
      , partials = content.haiku.partials
      , layout = layouts[content.get('layout')]
      , template = content._template
      , html
      , err
    ;

    var view = content.toView({
      site: content.haiku.toView(),
      yield: function(){
        var contentView = content.toView({
          site: content.haiku.toView()
        });

        return Mustache.to_html(template, contentView, partials);
      }
    });

    try {
      html = Mustache.to_html(layout, view, partials);
    } catch (e) {
      err = e;
    }

    callback(err, html);
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
      , contentdir = this.haiku.contentdir()
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
