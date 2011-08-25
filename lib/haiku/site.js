
var fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , Page = require('haiku/page')
  , Post = require('haiku/post')
;

// Constructor
var Site = function(options){
  this.root = options.source;
  this.build = options.destination;
  this._pagesDir = 'pages';
  this._postsDir = 'posts';
  this.posts = {};
  this.pages = {};

  // loop through the pages and create instances
  this.getPages();
  this.getPosts();
  // loop through the posts and create instances
};

Site.prototype.pagesDir = function(){
  var site = this;

  return path.join(site.root, site._pagesDir);
};

Site.prototype.postsDir = function(){
  var site = this;

  return path.join(site.root, site._postsDir);
};

Site.prototype.getPosts = function(){
  var site = this;

  site.postFiles = _.map(fs.readdirSync(site.postsDir()), function(filename){
    return path.join(site.postsDir(), filename);
  });

  _.each(site.postFiles, function(filename){
    post = new Post({ file: filename, root: this.root, site: this });
    site.posts[post.basename()] = post;
  });
};

Site.prototype.getPages = function(){
  var site = this;

  site.pageFiles = _.map(fs.readdirSync(site.pagesDir()), function(filename){
    return path.join(site.pagesDir(), filename);
  });

  _.each(site.pageFiles, function(filename){
    page = new Page({ file: filename, root: this.root, site: this });
    site.pages[page.basename()] = page;
  });
};

Site.prototype.render = function(){
  var site = this;
  // Zap the destination dir and create it again

  _.each(this.pages, function(page){
    page.render(site.build);
  });

  _.each(this.posts, function(post){
    post.render(site.build);
  });
};

exports = module.exports = Site;
