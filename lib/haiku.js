var path = require('path');

require.paths.unshift(path.join(__dirname, '..'));

var Origami = require('haiku/origami')
  , Configuration = require('haiku/configuration')
  , Collection = require('haiku/collection')
;

var Haiku = Origami.extend({
  initialize: function(configObject){
    if (configObject) {
      if (Haiku.config) Haiku.config.set(configObject);
      else Haiku.configure(configObject);

      // since the attributes would be set to the configs attrs
      this.attributes = {};
    }

    this.config = Haiku.config;
    this.content = new Collection();
  }

  // Reads in the source content into the haiku object structure, emits a
  // 'ready' function when the coast is clear
  , read: function(){
    // body...
    this.emit('ready');
  }

  // Find the content that matches the rules in the iterator
  , find: function(iterator){

  }
});

Haiku.configure = function(configObject){
  Haiku.config = Haiku.config || new Configuration(configObject);
};

exports = module.exports = Haiku;
