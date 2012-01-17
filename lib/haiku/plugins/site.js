var plugin = exports
  , haiku = require('../index')
;

plugin.name = 'site';

plugin.attach = function(){
  var app = this
  ;

  app.site = haiku.site;
};
