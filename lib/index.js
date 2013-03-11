
var properties = require('./properties')
  , EE = require('events').EventEmitter
  , extend = require('util')._extend

module.exports = Object.create({ handler: require('./handler')
  , configure: require('./configure')
  // For testing properties' setters and getters, should get called
  // anytime configure is called
  , reset: function(done){ this.__opts__ = {} }
  , has: require('./has')
  , read: require('./read')
  , get: get
  }
, properties)

// get the extender to make the EE methods non-enumerable so console.log
// doesn't look so nasty
extend(module.exports, EE.prototype)

function get(name){
  var haiku = this

  return haiku.pages[name] || haiku.pages[url(name)]
}

// make this a util or something this also duplicates
function url(name){
  var extensions = { '.md': '.html'
      , '.markdown': '.html'
      , '.mdown': ".html"
      , '.mustache': '.html'
      , '.mkdn': '.html'
      , '.mkd': '.html'
      }

  Object.keys(extensions).forEach(function(extension){
    if (name.match(extension)) {
      name = name.replace(extension, extensions[extension])
    }
  })

  if (! name.match('/^\//')) name = '/' + name

  return name
}
