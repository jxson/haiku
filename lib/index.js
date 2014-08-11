
const EE = require('events').EventEmitter
const inherits = require('inherits')
const assert = require('assert')
const fs = require('graceful-fs')
const path = require('path')
const xtend = require('xtend')
const defaults = {
  'source': process.cwd(),
  'content-dir': path.resolve('content'),
  'build-dir': path.resolve('build'),
  'templates-dir': path.resolve('templates'),
  'public-dir': path.resolve('public')
}
const allowed = Object.keys(defaults)

module.exports = Haiku

function Haiku(options) {
  if (!(this instanceof Haiku)) return new Haiku(options)

  options = options || {}

  var haiku = this

  EE.call(haiku)
  haiku.setMaxListeners(Infinity)

  haiku.options = {}
  haiku.status = 'new'

  haiku.configure(options)
}

inherits(Haiku, EE)

Haiku.prototype.is = function(status) {
  return this.status === status
}

Haiku.prototype.configure = function(options) {
  var haiku = this

  options = options || {}

  if (typeof options === 'string') {
    options = { source: options }
  }

  options = xtend(haiku.options, defaults, options)

  // Enforces source path resolution
  options.source = path.resolve(options.source)

  haiku.options = scrub(options)

  return haiku
}

Haiku.prototype.source = function(value) {
  var haiku = this

  if (arguments.length === 0) {
    return haiku.resolve('.')
  } else {
    return haiku.configure({ source: value })
  }
}

Haiku.prototype.resolve = function(option) {
  var haiku = this

  var args = Array.prototype.slice.call(arguments)

  if (option && option.match('-dir')) {
    args[0] = haiku.options[option]
  }

  args.unshift(haiku.options.source)

  return path.resolve.apply(null, args)
}

// It's possible that:
//
// * There has never been a read
// * The key just doesn't exist
// * The key exists but may need a refresh
Haiku.prototype.get = function(key, callback) {
  assert.equal(typeof callback, 'function', 'Callback required')

  var haiku = this
  var args = Array.prototype.slice.call(arguments)

  if (haiku.is('new')) haiku.read()

  if (haiku.is('new') || haiku.is('reading')) {
    callback = callback.bind(haiku, args)
    haiku.once('ready', callback)
  }
}

Haiku.prototype.read = function(callback) {
  callback = callback || function(){}

  var haiku = this
  var content = haiku.resolve('content-dir')

  haiku.emit('reading')

  haiku.once('error', callback)
  haiku.once('ready', callback)

  fs.exists(content, function onexists(exists){

  })
}

// Removes keys from the options object that do not have default vaules
function scrub(options) {
  Object.keys(options)
  .filter(check)
  .forEach(function(key){
    delete options[key]
  })

  return options
}

function check(option) {
  return allowed.indexOf(option) === -1
}
