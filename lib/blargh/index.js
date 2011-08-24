var path = require('path');

require.paths.unshift(path.join(__dirname, '..'));

var Site = require('blargh/site');

exports.generate = function(options){
  // console.log('options', options);

  site = new Site(options);
  site.render();
};


// var circle = require('./circle')
// var c = new circle.Circle(5)
// console.log(c.area());