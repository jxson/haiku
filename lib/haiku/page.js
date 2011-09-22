
// a page object basically encapsulates a file. the tricky part here is
// that it has to know how to render itself and may have an arbitrary number
// of content processors associated with it. we determine the processors to
// apply using the extensions. so "foo.textile.mustache" is first run through
// mustache and then textile.
//
// this doesn't work right now with partials, which are assumed to be rendered
// using whatever template processor the content that includes is using

var fs = require('fs')
  , _ = require("underscore")
  , yaml = require("yamlparser")
  , mustache = require('mustache')
  , markdown = require('marked')
  , textile = require('stextile')
  , util = require('util')
  , events = require('events')
  , path = require('path')
;

// # The Page Class

// ## Page Constructor
//
// Takes a single `options` argument
var Page = function(options) {
  var options = options || {};

  this.site = options.site; // parent site
  this.parent = options.parent; // parent collection
  this.path = options.path; // path of the file we're encapsulating
  this.data = ""; // the raw file content
  // this.site.logger.debug("creating a new page object for [" + this.path + "]");

  events.EventEmitter.call(this);
};

// # Page.extractAttributes
//
// A utility function that extracts attributes from the contents of a file passed in as the `data` argument
Page.extract = function(data){
  // http://stackoverflow.com/q/1068308
  var regex = /^(\s*---([\s\S]+)---\s*)/gi
    , match = regex.exec(data)
    , attributes
  ;

  if (match && match.length > 0){
    var yamlString = match[2].replace(/^\s+|\s+$/g, '')
      , template = data.replace(match[0], '')
      , yamlAttributes
    ;

    attributes = yaml.eval(yamlString);
  } else {
    attributes = {};
    template = data;
  }

  return {
    attributes: attributes,
    template: template
  };
};

// ## Page.processors
//
// `Page.processors` is an object that has functions with common interfaces for each of the supported processors.
//
// Each processor takes the arguments:
//
// - `content` - **string** - the page template data minus the yaml front
// matter)
// - `attributes` - **object** - any attributes to use in the processor
// - `site` - **object** - expected to be the `page.site` object
Page.processors = {
  textile: function(content, attributes, site) {
    return textile(content);
  },
  mustache: function(content, attributes, site) {
    return mustache.to_html(content, attributes, site.partials);
  },
  markdown: function(content, attributes, site) {
    return markdown(content);
  }
};

Page.extensions = {
  markdown: ['.md', '.markdown', '.mdown', '.mkdn', '.mkd'],
  html: ['.mustache', '.html']
};

// `Page` inherits from `EventEmitter`
util.inherits(Page, events.EventEmitter);

_.extend(Page.prototype, {

  // ## page.read()
  //
  // dear page, please read yourself ...
  read: function() {
    var page = this
      , log = this.site.logger
    ;

    log.info('reading contents of file [' + page.path + ']');

    // we start by just reading the raw data asynchronously
    fs.readFile(page.path, 'utf8', function(err, data) {
      // TODO: emit the error if there are listeners, if there are no
      // listeners throw the error instead
      if (err) throw err;

      // wonderful! we have the content! let's turn it into a resource
      // (extract the front-matter, split into attributes and data)
      extract = Page.extract(data);

      page.attributes = extract.attributes;
      page.template = extract.template;


      // // set the name, which is a bit tricky since we might have
      // // a bunch of different extensions to invoke different processors
      // // in the process, btw, we also set up the processing pipeline
      // page._parseName();
      //

      // page.name = page.path;

      // // okay, we're done! let our caller know ...
      // callback();
      // console.log('read', page.url());
      page.emit('ready');
    });
  },

  // ## page.name()
  //
  // Convenience method to get the `page.basename()` without the '.mustache'
  // extension
  name: function(){
    return this.basename().replace('.mustache', '');
  },

  // ## page.basename()
  //
  // Convenience method that wraps path.basename(site.path) relative to
  // `site.parent`
  basename: function(){
    return path.basename(this.path);
  },

  // ## page.url()
  //
  // Get the url (final build destination) for this page
  url: function(){
    if (! this.buildPath()){ return; }

    return this.site.options.baseURL + this.buildPath();
  },

  // ## page.buildPath()
  //
  // Get the path to where this page will be compiled to
  buildPath: function(){
    if (! this.path) return;

    var contentDir = this.site.options.contentDir
      , contentRegex = new RegExp('(.*)\\/' + contentDir + '\\/', 'g')
      // Remove everything in the path before the `site.contentDir`
      , pathname = this.path.replace(contentRegex, '')
      , basename = path.basename(pathname)
      , extension = 'html'
      // Explode the basename and remove extensions that wont get compiled
      , dots = _.without(basename.split('.'),
          'mustache',
          'md',
          'markdown',
          'mdown',
          'mkdn',
          'mkd',
          'textile')
    ;

    // No extension? defaults to .html
    if (dots.length === 1) dots.push(extension);

    newBasename = dots.join('.');

    return pathname.replace(basename, newBasename);
  },

  // ## page.parser()
  //
  // Returns the parser to use when rendering the page by looking at the
  // filename
  parser: function(){
    if (!this.path) return;

    var basename = path.basename(this.path, '.mustache')
      , extension = path.extname(basename)
      , parser
    ;

    if (_.include(Page.extensions.markdown, extension)){
      parser = 'markdown';
    }

    if (extension === '.textile'){
      parser = 'textile';
    }

    if (_.include(Page.extensions.html, extension)){
      parser = undefined;
    }

    return parser
  },

  // ## page._processor(data, attributes, site)
  //
  // An internal convenience method for calling the correct `Page.processors`
  // function after pre-processing with mustache
  _processor: function(data, attributes, site){
    var parser = this.parser()
      , preprocessed = Page.processors.mustache(data, attributes, site)
    ;

    if (parser){
      return Page.processors[parser](preprocessed, attributes, site);
    } else {
      return preprocessed;
    }
  },

  // ## page.renderWithoutLayout()
  //
  // The name says everything
  renderWithoutLayout: function(attributes) {
    var page = this
      , attributes = attributes || {}
    ;

    // Allow passed in attributes to take precedence over the previously
    // defined `page.attributes` without being modified
    _.defaults(attributes, page.attributes);

    return page._processor(page.template, attributes, page.site);
  },

  // ## page.toJSON()
  //
  // Returns a simplified version of the page object to be used in the
  // templates.
  toJSON: function(){
    var page = this;

    return _.extend({
      content: page.renderWithoutLayout()
    }, page.attributes);
  },

  // ## page.render()
  //
  // Once a page has been read, it can be rendered. This involves
  // invoking the appropriate content processors and returning the result.
  //
  // An additional `attributes` argument can be passed in and will be made
  // available to the templates.
  render: function(attributes){
    var page = this
      , attributes = attributes || {}
      , layout
      , content
    ;

    // If there is a layout get it.
    if (page.attributes.layout){
      layout = page.site.layouts.find(page.attributes.layout);
    }

    // `page.site` is available to the templates and lazily evaluated
    attributes.site = function(){
      return page.site.toJSON();
    }

    content = page.renderWithoutLayout(attributes);

    // If there is a layout render it with the content
    if (layout){
      attributes.yield = content;

      return layout.render(attributes);
    } else {
      return content;
    }
  }
});

module.exports = Page;