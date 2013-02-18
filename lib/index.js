
var properties = require('./properties')
  , EE = require('events').EventEmitter
  , extend = require('util')._extend

module.exports = Object.create({ handler: require('./handler')
  , configure: require('./configure')
  // For testing properties' setters and getters
  , reset: function(done){ this.__opts__ = {} }
  , has: require('./has')
  , read: require('./read')
  }
, properties)

extend(module.exports, EE.prototype)
