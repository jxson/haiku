
var fs = require('fs')
  , path = require('path')
  , _ = require('underscore')
  , Content = require('haiku/content')
  // , Page = require('haiku/page')
  // , Post = require('haiku/post')
;

// Constructor
var Site = function(attributes){
  var attributes = attributes || {};

  this.attributes = _.defaults(attributes, {
    source: process.cwd(),
    destination: path.join(process.cwd(), 'build')
  });

  this.content = [];

  // this._pagesDir = 'pages';
  // this._postsDir = 'posts';
  // this.posts = [];
  // this.pages = [];
  //
  // // loop through the pages and create instances
  // this.getPages();
  // this.getPosts();
  // // loop through the posts and create instances

  this.load();
};

Site.prototype.get = function(attr){
  return this.attributes[attr];
}

Site.prototype.contentDirectory = function(){
  return this.get('source') + '/content';
}

Site.prototype.load = function(){
  var site = this;

  var files = fs.readdirSync(this.contentDirectory());

  _.each(files, function(file){
    var fullFilePath = path.join(site.contentDirectory(), file);
    var stats = fs.lstatSync(fullFilePath);

    if (stats.isDirectory()){
      console.log('===> ' + file + ' is a dir <===');
    } else {
      console.log('file', file);
      var conent = new Content({ file: fullFilePath });
      site.content.push(conent);
    }
  });

  // console.log('files', files);

  // Fs.lstatSync

  // console.log('content: ', );
};

//
// Site.prototype.pagesDir = function(){
//   var site = this;
//
//   return path.join(site.root, site._pagesDir);
// };
//
// Site.prototype.postsDir = function(){
//   var site = this;
//
//   return path.join(site.root, site._postsDir);
// };
//
// Site.prototype.getPosts = function(){
//   var site = this;
//
//   site.postFiles = _.map(fs.readdirSync(site.postsDir()), function(filename){
//     return path.join(site.postsDir(), filename);
//   });
//
//   _.each(site.postFiles, function(filename){
//     post = new Post({ file: filename, root: this.root, site: this });
//     site.posts.push(post);
//   });
// };
//
// Site.prototype.getPages = function(){
//   var site = this;
//
//   site.pageFiles = _.map(fs.readdirSync(site.pagesDir()), function(filename){
//     return path.join(site.pagesDir(), filename);
//   });
//
//   _.each(site.pageFiles, function(filename){
//     page = new Page({ file: filename, root: this.root, site: this });
//     site.pages.push(page);
//   });
// };
//
// Site.prototype.render = function(){
//   var site = this;
//   // Zap the destination dir and create it again
//
//   _.each(this.pages, function(page){
//     page.render(site.build);
//   });
//
//   _.each(this.posts, function(post){
//     post.render(site.build);
//   });
// };

exports = module.exports = Site;
