// var
//   , fs = require('fs')
//   , mkdirp = require('mkdirp')
//   , Mustache = require('mustache')
// ;

var Origami = require('haiku/origami')
  , fs = require('fs')
  , yaml = require('yaml')
  , path = require('path')
  , _ = require('underscore')

  , colors = require('colors')
;

var Content = Origami.extend({
  initialize: function(attributes){
    // console.log('attributes'.blue, this.attributes);

    // defaults?
  },

  read: function(){
    this.extractAttributesFromFile(function(err, content){
      content.emit('ready');
    });
  },

  extractAttributesFromFile: function(callback){
    // http://stackoverflow.com/q/1068308
    var regex = /^(\s*---([\s\S]+)---\s*)/gi
      , content = this
      , callback = callback;
    ;

    fs.readFile(this.get('file'), 'utf8', function(err, data){
      if (err) throw err;

      var match = regex.exec(data);

      if (match.length > 0){
        var yamlString = match[2].replace(/^\s+|\s+$/g, '')
          , template = data.replace(match[0], '')
          , yamlAttributes
        ;

        attributes = yaml.eval(yamlString);
        content._template = template;

        content.set(attributes);

        callback(null, content);
      } else {
        var message = "Haiku can't read the file: \n  " + content.get('file')
          , err = new Error(message);
        ;

        callback(err, content);
      }
    });
  },

  parser: function(){
    if (!this.get('file')) return;

    var extname = path.extname(this.get('file'))
      , markdownExtensions = ['.md', '.markdown', '.mdown', '.mkdn', '.mkd']
      , htmlExtensions = ['.mustache', '.html']
    ;

    if (_.include(markdownExtensions, extname)){
      return 'markdown';
    }

    if (extname === '.textile'){
      return 'textile';
    }

    if (_.include(htmlExtensions, extname)){
      return undefined;
    }
  },

  url: function(){
    if (! this.get('file')) return;

    var pathname = this.get('file').replace(/(.*)\/content\//g, '')
        originalExtension = path.extname(this.get('file'))
        url = pathname.replace(originalExtension, this._extension())
    ;

    return url;
  },

  _extension: function(){
    if (! this.get('file')) return;

    var basename = path.basename(this.get('file'))
      , prextArray = basename.split('.')
    ;

    if (prextArray.length > 2){
      prext = prextArray[prextArray.length - 2]
    } else {
      prext = 'html'
    }

    return '.' + prext;
  },

  render: function(callback){

  }
});

// // Constructor
// var Content = function(attrs){
//   this.site = attrs.site;
//   delete attrs.site;
//
//   this.attributes = _.defaults(attrs, {
//     //   title: 'Random page title'
//     // , description: 'Random page description'
//       publish: true
//     , layout: 'default'
//   });
//

// Content.prototype.toView = function(helpers){
//   var view = _.clone(this.attributes)
//     , helpers = helpers || {}
//   ;
//
//   _.extend(view, helpers);
//
//   console.log('=======> content.view'.yellow, view);
//
//   return view;
// };
//
// Content.prototype.layout = function(){
//   var filename = path.join('examples/basic/templates/layouts', this.attributes.layout + '.mustache')
//
//   return fs.readFileSync(filename, 'utf8');
// };
//
// // make sure to check for layouts
// Content.prototype.render = function(buildDir){
//   var content = this;
//   // render the mustache
//
//   console.log('content.toView() \n'.yellow, content.toView());
//
//   // var layoutView = {
//   //   yield: function(){
//   //     return Mustache.to_html(content.get('template'), content.toView());
//   //   },
//   // };
//
//   // var html = Mu.compileText(this.attributes.template);
//   // var html = Mustache.to_html(this.layout(), layoutView);
//   // var html = Mustache.to_html(content.get('template'), content.toView());
//
//   console.log('content.site.posts'.red, content.site.posts);
//
//   var helpers = {
//     yield: function(){
//       return Mustache.to_html(content.get('template'), content.toView({
//         posts: _.map(content.site.get('posts'), function(item){
//           return item.toView();
//         })
//       }));
//     }
//   }
//
//   _.extend(helpers, content.toView());
//
//   var html = Mustache.to_html(this.layout(), content.site.toView(helpers));
//
//   return html;
//   // var filename = path.join(buildDir, this.basename() + '.html');
//   //
//   // mkdirp(path.resolve(buildDir), 0755, function(err){
//   //   if (err) { return console.error(err); }
//   //
//   //   fs.writeFileSync(filename, html);
//   // });
// };

exports = module.exports = Content;
