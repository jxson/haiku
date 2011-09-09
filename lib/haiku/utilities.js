var _= require("underscore")
  , yaml = require("yaml")
;

exports.getNameFromPath = function(path) {
  var extensions = "html htm ico png jpg jpeg gif".split();
  var components = _(path.split("/")).last().split(".").slice(0,2);
  if (_(extensions).include(components[1])) {
    return components.join(".");
  } else { return components[0]; }
};

exports.extractFrontMatter = function(data) {
  var regex = /^(\s*---([\s\S]+)---\s*)/gi
      , match = regex.exec(data)
  ;
  if (match && match.length > 0) {
    var yamlString = match[2].replace(/^\s+|\s+$/g,'')
      , template = data.replace(match[0],'')
      , yamlAttributes
    ;

    return {
      content: template,
      attributes: yaml.eval(yamlString)
    };
  } else {
    return {
      content: data,
      attributes: {}
    }
  }
};

