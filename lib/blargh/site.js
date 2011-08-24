
var fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , Page = require('blargh/page')
;

// Constructor
var Site = function(options){
  this.root = options.source;
  this.build = options.destination;
  this._pagesDir = 'pages';
  this.posts = {};
  this.pages = {};

  // loop through the pages and create instances
  this.getPages();
  // loop through the posts and create instances
};

Site.prototype.pagesDir = function(){
  var site = this;

  return path.join(site.root, site._pagesDir);
};

Site.prototype.getPages = function(){
  var site = this;

  site.pageFiles = _.map(fs.readdirSync(site.pagesDir()), function(filename){
    return path.join(site.pagesDir(), filename);
  });

  _.each(site.pageFiles, function(filename){
    console.log('new page', filename);

    // content = fs.readFileSync(pageFile, 'utf8');
    //
    // console.log('content', content);

    page = new Page({ file: filename });

  });
};

Site.prototype.render = function(){
  // Zap the destination dir and create it again
  console.log('render');
};

exports = module.exports = Site;
