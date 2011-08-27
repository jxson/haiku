var path = require('path');

require.paths.unshift(path.join(__dirname, '..'));

var Orgami = require('haiku/orgami');

var Haiku = Orgami.extend({},{
  // Read the source content into a new instance of the Haiku constructor;
  read: function(source){
    console.log('FOOBAR');
  }
});

exports = module.exports = Haiku;
