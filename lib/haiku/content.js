var fs = require('fs')
  , _ = require("underscore")
  , mustache = require('mustache')
  , markdown = require('discount')
  , textile = require('stextile')
  , Utilities = require("lib/haiku/utilities")
;

var Content = function(options) {
  this.context = options.context;
  this.parent = options.parent||"root";
  this.path = options.path;
  this.pipeline = Content.buildPipelineFromPath(options.path);
  this.content = "";
  this.context.logger.debug("creating a new content object for [" + options.path + "]");
};

Content.processors = {
  textile: function(content,attributes) {
    return textile(content);
  },
  mustache: function(content,attributes) {
    mustache.to_html(content,attributes);
  },
  markdown: function(content,attributes) {
    return markdown.parse(content);
  }
}

Content.buildPipelineFromPath = function(path) {
  return _(_(path.split("/")).last().split(".")).rest().reduceRight(function(pipeline,extension) {
    pipeline.push(Content.processors[extension]); return pipeline;  
  },[]);
}

Content.prototype = {
  read: function(callback) {
    var content = this
      , log = content.context.logger
      , yaml = require('yaml')
    ;
      
    log.info("reading contents of file [" + content.path + "]");
    fs.readFile(content.path, 'utf8', function(err, data) {
      if (err) { throw err; }
      data = Utilities.extractFrontMatter(data);
      content.attributes = data.attributes;
      content.content = data.content;
      content.name = Utilities.getNameFromPath(content.path);
      callback();
    });
  },
  render: function() {
    var content = this;
    console.log(this.pipeline);
    return _(content.pipeline).reduce(function(memo,processor) {
      return processor(memo,this.attributes);
    },content.content);
  }
}

module.exports = Content;