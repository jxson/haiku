
var properties = require('./properties')

module.exports = Object.create({ handler: require('./handler')
  , configure: require('./configure')
  // For testing properties' setters and getters
  , reset: function(done){ this.__opts__ = {} }
  , has: require('./has')
  }
, properties)


// has(url)