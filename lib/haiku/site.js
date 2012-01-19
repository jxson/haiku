
var Site
  , path = require('path')
  , EE = require('events').EventEmitter
  , inherits = require('inherits')
  , _ = require('underscore')
;

Site = function(options){
  var site = this
    , options = options || {}
    , source
  ;

  site.options = { source: options.source || process.cwd()
  , baseURL: options.baseURL || '/'
  , index: options.index || 'index.html'
  };

  source = site.options.source;

  site.directories = { content: path.join(source, 'content')
  , templates: path.join(source, 'templates')
  , public: path.join(source, 'public')
  , build: path.join(source, 'build')
  };

  EE.call(this);
};

inherits(Site, EE);

Site.prototype.deploy = function(){
  var site = this
  ;
};

module.exports = function(options){
  return new Site(options);
};

module.exports.Site = Site;
