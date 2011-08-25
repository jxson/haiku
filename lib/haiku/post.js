var _ = require('underscore')
  , fs = require('fs')
  , mkdirp = require('mkdirp')
  , path = require('path')
  , yaml = require('yaml')
  , Mustache = require('mustache')
;

// Constructor
var Post = function(options){
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

Post.prototype.file = function(path){
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

Post.prototype.basename = function(){
  return path.basename(this.attributes.file, '.' + this.format());
};

// Make it a setter and a little more intelligent
Post.prototype.format = function(){
  var extension = path.extname(this.attributes.file);
  return extension.replace('.', '');
};

Post.prototype.layout = function(){
  var filename = path.join('examples/basic/templates/layouts', this.attributes.layout + '.mustache')

  return fs.readFileSync(filename, 'utf8');
};

Post.prototype.render = function(buildDir){
  var page = this;
  // render the mustache
  var layoutView = {
    yield: function(){
      return Mustache.to_html(page.attributes.template, page)
    }
  };

  var html = Mustache.to_html(this.layout(), layoutView);
  var filename = path.join(buildDir, 'posts', this.basename() + '.html');

  mkdirp(path.resolve(buildDir) + '/posts', 0755, function(err){
    if (err) { return console.error(err); }

    fs.writeFileSync(filename, html);
  })
};

exports = module.exports = Post;
