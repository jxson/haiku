var _ = require('underscore')
  , fs = require('fs')
  , yaml = require('yaml')
;

// Constructor
var Page = function(options){
  this.attributes = _.defaults(options, {
      title: 'Random page title'
    , description: 'Random page description'
    , publish: true
    , layout: 'page'
  });

  if (options.file) {
    // set the file, this will extract attributes
    this.file(options.file);
  }
};

Page.prototype.file = function(path){
  console.log('.file(path): ', path);

  // read the file
  var data = fs.readFileSync(path, 'utf8');

  // http://stackoverflow.com/questions/1068280/javascript-regex-multiline-flag-doesnt-work
  var frontMatterRegex = /^(\s*---([\s\S]+)---\s*)/gi;
  var matchArray = frontMatterRegex.exec(data);

  // extract the yaml front matter
  if (matchArray.length > 0){
    var yamlString = matchArray[2].replace(/^\s+|\s+$/g, '');
    var template = data.replace(matchArray[0], '');

    attributes = yaml.eval(yamlString);

    _.extend(this.attributes, attributes);
  }
}

exports = module.exports = Page;
