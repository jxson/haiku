var path = require('path');

require.paths.unshift(path.join(__dirname, '..'));

var Origami = require('haiku/origami')
  , Configuration = require('haiku/configuration')
;

var Haiku = Origami.extend({});

// Read the source content into a new instance of the Haiku constructor;
Haiku.read = function(source){

};

Haiku.configure = function(configObject){
  Haiku.config = Haiku.config || new Configuration(configObject);
};

exports = module.exports = Haiku;
