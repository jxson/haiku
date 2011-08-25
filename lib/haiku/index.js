var path = require('path');

require.paths.unshift(path.join(__dirname, '..'));

var Site = require('haiku/site');

exports.generate = function(options){
  // console.log('options', options);

  site = new Site(options);
  site.render();
};
