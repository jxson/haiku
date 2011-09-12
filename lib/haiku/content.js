var fs = require('fs')
  , _ = require("underscore")
  , yaml = require("yaml")
  , mustache = require('mustache')
  , markdown = require('discount')
  , textile = require('stextile')
;

var Content = function(options) {
  this.site = options.site;
  this.parent = options.parent||"root";
  this.path = options.path;
  this.data = "";
  this.site.logger.debug("creating a new content object for [" + options.path + "]");
};

Content.processors = {
  textile: function(content,attributes,site) {
    return textile(content);
  },
  mustache: function(content,attributes,site) {
    return mustache.to_html(content,attributes,site.partials);
  },
  markdown: function(content,attributes,site) {
    return markdown.parse(content);
  }
}

Content._createResource = function(data) {
  var regex = /^(\s*---([\s\S]+)---\s*)/gi
      , match = regex.exec(data)
  ;
  if (match && match.length > 0) {
    var yamlString = match[2].replace(/^\s+|\s+$/g,'')
      , template = data.replace(match[0],'')
      , yamlAttributes
    ;

    return {
      "data": template,
      attributes: yaml.eval(yamlString)
    };
  } else {
    return {
      "data": data,
      attributes: {}
    }
  }
};

Content.prototype = {
  read: function(callback) {
    var content = this
      , log = content.site.logger
      , yaml = require('yaml')
      , resource
    ;
      
    log.info("reading contents of file [" + content.path + "]");
    fs.readFile(content.path, 'utf8', function(err, data) {
      if (err) { throw err; }
      resource = Content._createResource(data);
      content.attributes = resource.attributes;
      content.data = resource.data;
      // sets the name 
      content._parseName();
      callback();
    });
  },
  
  render: function(_attributes) {
    var content = this
      , attributes = (_attributes||{})
      , html = _(content.pipeline).reduce(function(memo,processor) {
            return processor(memo,(_.defaults(attributes,content.attributes)),content.site);
          },content.data)
      , layout = (this.attributes.layout && this.site.folder.templates.folder.layouts.folder[this.attributes.layout])
      ;
    if (layout) {
      attributes.content = html;
      return layout.render(attributes);
    } else {
      return html;
    }
  },
  
  _parseName: function() {
    var components = _(_(this.path.split("/")).last().split("."))
      , processor
      , pipeline = []
      ;

    while (components.size()>0 && 
        (processor = Content.processors[components.last()])) {
      components.pop();
      pipeline.push(processor);
    }
    this.name = components.join(".");
    this.pipeline = pipeline;
  }
  
}

module.exports = Content;