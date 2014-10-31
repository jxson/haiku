
const EE = require('events').EventEmitter
const inherits = require('inherits')
const assert = require('assert')
const fs = require('graceful-fs')
const path = require('path')
const xtend = require('xtend')
const error = require('./formatted-error')
const defaults = {
  'source': process.cwd(),
  'content-dir': 'content',
  'build-dir': 'build',
  'templates-dir': 'templates',
  'public-dir': 'public'
}
const allowed = Object.keys(defaults)
const debug = require('debug')
const through = require('through2')
const powerwalk = require('powerwalk')
const store = require('./store')
const read = require('./read')
const template = require('./template')
const Page = require('./page')
const marked = require('marked')

module.exports = Haiku
module.exports.defaultOptions = defaults

// States: new, reading, read
// Events: error, reading, read
function Haiku(options) {
  if (!(this instanceof Haiku)) return new Haiku(options)

  options = options || {}

  var haiku = this

  EE.call(haiku)
  haiku.setMaxListeners(Infinity)

  haiku.options = {}
  haiku.status = 'new'
  haiku.debug = debug('haiku')

  haiku.configure(options)

  haiku.store = store()
  haiku.template = template(haiku.resolve('templates-dir'))


  haiku.on('reading', function isreading(){ haiku.status = 'reading' })
  haiku.on('ready', function isready(){ haiku.status = 'ready' })
}

inherits(Haiku, EE)

Haiku.prototype.is = function(status) {
  var haiku = this

  return haiku.status === status
}

// TODO: add gaurd to ensure this only gets called once.
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
  var args = [].slice.call(arguments)

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
  var debug = haiku.debug

  callback = callback.bind(haiku)

  debug('get: %s', key)

  if (haiku.is('new')) {
    haiku
    .createReadStream()
    .on('error', callback)
  }

  if (haiku.is('new') || haiku.is('reading')) {
    debug('get call is deffered until ready')
    get = haiku.get.bind(haiku, key, callback)
    haiku.once('ready', get)
  } else haiku.store.get(key, onget)

  function onget(err, page) {
    if (err && err.notFound) {
      callback(error('page "%s" not found', key))
    } else callback(err, page)
  }
}

Haiku.prototype.read = function(callback) {
  var haiku = this
  var debug = haiku.debug
  var stream = haiku.createReadStream()

  debug('reading via h.read(callback)')

  if (callback) {
    callback = callback.bind(this)

    stream.on('error', callback)
    stream.on('finish', callback)
  }

  return stream
}

Haiku.prototype.createReadStream = function(opts) {
  var haiku = this
  var store = haiku.store
  var debug = haiku.debug
  var content = haiku.resolve('content-dir')
  var stream = through.obj(write, flush)

  haiku.emit('reading')

  fs.exists(content, onexist)

  return stream

  function onexist(exists) {
    if (! exists) {
      var err = error('content-dir="%s" does not exist', content)
      return stream.emit('error', err)
    }

    debug('walking %s', content)

    powerwalk(content)
    .pipe(stream)
  }

  function write(chunk, enc, callback) {
    var filename = chunk.toString()

    debug('file: %s', filename)

    read(filename, content, function(err, page) {
      if (err) callback(err)
      else store.put(page, callback)
    })
  }

  function flush(callback) {
    haiku.emit('ready')
    callback()
  }
}

Haiku.prototype.render = function(key, context, callback) {
  var haiku = this
  var debug = haiku.debug

  if (typeof context === 'function') {
    callback = context
    context = {}
  }

  haiku.get(key, function(err, json) {
    if (err) return callback(err)

    var page = Page(json)

    callback = callback.bind(page)

    debug('rendering page: %s', page.url)

    haiku.template.set(page.url, page.body)
    haiku.template.render(page.url, { page: page }, function(err, content) {
      if (err) return callback(err)

      if (page.is('markdown') && page.wants('html')) {
        content = marked(content)
      } else {
        // No layout processing is required, bail...
        return callback(null, content)
      }

      // get the layout
      var layout = 'layouts/' + page.layout + '.mustache'
      var context = xtend({
        page: page,
        'layout-content': content
      })

      haiku
      .template
      .render(layout, context, callback)
    })
  })
}

// Removes keys from the options object that do not have default vaules
function scrub(options) {
  Object
  .keys(options)
  .filter(bad)
  .forEach(function(key){
    delete options[key]
  })

  return options
}

function bad(option) {
  return allowed.indexOf(option) === -1
}
