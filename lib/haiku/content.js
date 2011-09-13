var fs = require('fs')
  , _ = require("underscore")
  , yaml = require("yaml")
  , mustache = require('mustache')
  , markdown = require('discount')
  , textile = require('stextile')
;

// a content object basically encapsulates a file. the tricky part here is 
// that it has to know how to render itself and may have an arbitrary number
// of content processors associated with it. we determine the processors to
// apply using the extensions. so "foo.textile.mustache" is first run through
// mustache and then textile. 
//
// this doesn't work right now with partials, which are assumed to be rendered
// using whatever template processor the content that includes is using
var Content = function(options) {
  this.site = options.site; // parent site
  this.parent = options.parent; // parent collection
  this.path = options.path; // path of the file we're encapsulating
  this.data = ""; // the raw file content
  this.site.logger.debug("creating a new content object for [" + options.path + "]");
};

// we can add processors here -- a processor is just a function that takes the
// content data (not the object), any attributes to use in the processor, and
// the site itself. a processor is free to ignore whichever of these it wants.
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

// a utility function that extracts any "front-matter" from the data
// and parses it as YAML; we return an object with a data property
// and an attributes property
Content._createResource = function(data) {

  // http://stackoverflow.com/q/1068308
  var regex = /^(\s*---([\s\S]+)---\s*)/gi
      , match = regex.exec(data)
  ;

  // if we have a match ...
  if (match && match.length > 0) {
    
    // extract the YAML (get rid of leading and trailing whitespace)
    var yamlString = match[2].replace(/^\s+|\s+$/g,'')
      
    // extract the template, sans the YAML
      , template = data.replace(match[0],'')
    ;

    // return the resource object, with attributes
    return {
      "data": template,
      attributes: yaml.eval(yamlString)
    };
    
  } else { // we didn't have a match ...
    return {
      "data": data, // return the data we got
      attributes: {} // with no attributes
    }
  }
};

Content.prototype = {
  
  // dear content, please read yourself ...
  read: function(callback) {
    var content = this
      , log = content.site.logger
      , resource
    ;
      
    log.info("reading contents of file [" + content.path + "]");

    // we start by just reading the raw data asynchronously
    fs.readFile(content.path, 'utf8', function(err, data) {
      if (err) { throw err; }
      
      // wonderful! we have the content! let's turn it into a resource
      // (extract the front-matter, split into attributes and data)
      resource = Content._createResource(data);
      
      // we're just going to keep these as part of the object
      content.attributes = resource.attributes;
      content.data = resource.data;
      
      // set the name, which is a bit tricky since we might have 
      // a bunch of different extensions to invoke different processors
      // in the process, btw, we also set up the processing pipeline
      content._parseName();
      
      // okay, we're done! let our caller know ...
      callback();
    });
  },
  
  // once a content object is read, we can render it. this involves
  // invoking all the appropriate content processors and returning the result
  //
  // you can pass in additional attributes if you want, which is handy for
  // layout-type content objects, where they want the HTML for their
  // content as an attribute ...
  render: function(_attributes) {
    var content = this
    
    // we use the _attributes object passed in or a newly constructed object
    // and add in the content object's attributes. using _.defaults ensures
    // that the content object gets priority, without modifying it
      , attributes = _.defaults((_attributes||{}) ,content.attributes)
      
    // here we just go through each processor, passing it the result from 
    // the previous processor along with the attributes and site object
      , html = _(content.pipeline).reduce(function(data,processor) {
            return processor(data, attributes, content.site);
          },content.data)
        
    // if there's a layout object, let's go ahead and get it
      , layout = (this.attributes.layout && 
          this.site.layouts.resolve(this.attributes.layout))
      ;
      
    // if we have a layout, we want to render it, passing in the html we got 
    // from the content object as an attribute called "content" ..
    if (layout) {
      attributes.content = html;
      return layout.render(attributes);
    } else { // otherwise, just return the html directly
      return html;
    }
  },
  
  // parse the name, using the extension elements to build up the content
  // processing pipeline ...
  _parseName: function() {
    var extensions = _(_(this.path.split("/")).last().split("."))
      , processor
      , pipeline = []
      ;

    // go through all the extensions until we either have no more of them
    // or we've hit one that we don't have a processor for (this gives us an
    // automatic stop on extensions like "jpg" or "ico" or whatever).
    //
    // we record the processor on the fly with the processor= bit in the test
    while (extensions.size()>0 && 
        (processor = Content.processors[extensions.last()])) {
      
      // alright, move on to the next extensions
      extensions.pop();
      
      // and add that processor to our pipeline
      pipeline.push(processor);
    }
    
    // whatever's left is the proper name of the content object
    // ex:  foo.html.textile.mustache
    // will pop mustache and then textile, adding them as processors
    // and leave us with foo.html ...
    this.name = extensions.join(".");
    
    // and finally, save the pipeline as part of the object
    this.pipeline = pipeline;
  }
  
}

module.exports = Content;