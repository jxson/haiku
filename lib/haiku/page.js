var _ = require('underscore')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , path = require('path')
  , yaml = require('yaml')
  , Mustache = require('mustache')
;

// Constructor
var Page = function(options){
  this.attributes = _.defaults(options, {
      title: 'Random page title'
    , description: 'Random page description'
    , publish: true
    , layout: 'default'
  });

  if (options.file) {
    // set the file, this will extract attributes
    this.file(options.file);
  }
};

Page.prototype.file = function(path){
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
    attributes.template = template;

    _.extend(this.attributes, attributes);
  }
};

// Page.prototype.uri = function(){
//   return ;
// };

Page.prototype.basename = function(){
  return path.basename(this.attributes.file, '.' + this.format());
};

// Make it a setter and a little more intelligent
Page.prototype.format = function(){
  var extension = path.extname(this.attributes.file);
  return extension.replace('.', '');
};

Page.prototype.title = function(){
  return this.attributes.title;
};

Page.prototype.layout = function(){
  var filename = path.join('examples/basic/templates/layouts', this.attributes.layout + '.mustache')

  return fs.readFileSync(filename, 'utf8');
};

// make sure to check for layouts
Page.prototype.render = function(buildDir){
  var page = this;
  // render the mustache
  var layoutView = {
    yield: function(){
      return Mustache.to_html(page.attributes.template, page)
    }
  };

  // var html = Mu.compileText(this.attributes.template);
  var html = Mustache.to_html(this.layout(), layoutView);

  return html;
  // var filename = path.join(buildDir, this.basename() + '.html');
  //
  // mkdirp(path.resolve(buildDir), 0755, function(err){
  //   if (err) { return console.error(err); }
  //
  //   fs.writeFileSync(filename, html);
  // });
};

exports = module.exports = Page;
