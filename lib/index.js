
module.exports = function(src, options){
  // Decorating req, res objects?
  var req
    , res

  for (var i = 0; i < arguments.length; i ++){
    var arg = arguments[i]
      , isLast

    if (arg instanceof require('http').IncomingMessage) req = arg
    if (arg instanceof require('http').ServerResponse) res = arg
    if (typeof arg === 'string') src = arg
  }

  // assign options, the last arg that isn't a req, res, or string
  var last = arguments[arguments.length - 1]
    , isObject = typeof last === 'object'
    , isNotDecorating = (last !== req || last !== req)
    , options = isObject && isNotDecorating ? last : {}

  if (src) options.src = src

  // Okay, time to stop messing around
  var haiku = new Haiku(options)

  // TODO: if there is a req, res return the decorator

  // Start reading the content after the return
  process.nextTick(function(){
    haiku.read()
  })

  return haiku
}

var EE = require('events').EventEmitter

function Haiku(options){
  var haiku = this

  // setup
  haiku.pages = []
  haiku.isReading = false
  haiku.opts = {}

  haiku.configure(options)

}

// Inherit from Event Emitter
Haiku.prototype.__proto__ = EE.prototype

Haiku.prototype.configure = function(options){
  var haiku = this

  Object.keys(options).forEach(function(key){
    haiku.opt(key, options[key])
  })

  return haiku
}

Haiku.prototype.opt = function(option, value){
  var haiku = this
    , path = require('path')

  switch (option) {
    case 'src'          : return dir('src', value)
    case 'content-dir'  : return dir('content', value)
    case 'build-dir'    : return dir('build', value)
    case 'templates-dir': return dir('templates', value)
    case 'public-dir'   : return dir('public', value)
  }

  function dir(name, v){
    var o = name === 'src' ? name : name + '-dir'

    // if asking for the src and it's not defined default to process.cwd()
    if (o === 'src' && ! value && ! haiku.opts[o]) return process.cwd()

    if (v) return haiku.opts[o] = path.resolve(haiku.opt('src'), v)
    else return haiku.opts[o] || path.resolve(haiku.opt('src'), name)
  }

  return haiku
}

// Async content finder
Haiku.prototype.find = function(name, callback){
  var haiku = this

  if (haiku.isReading) {
    haiku.once('error', callback)
    haiku.once('end', filter)
  } else process.nextTick(filter)

  function filter(){
    // trailing slash? It's an index
    var name = name.replace(/\/$/, '/index.html')
      , filtered = haiku.pages.filter(function(page){
          return page.name === name || page.url === name
        })

    return filtered[0]
  }
}


Haiku.prototype.read = function(){
  var haiku = this
    , powerwalk = require('powerwalk')

  haiku.isReading = true

  powerwalk(haiku.opt('content-dir'))
  .on('error', function(err){ haiku.emit('error', err) })
  .on('file', add)

  function add(filename){
    console.log('adding', filename)
  }
}
