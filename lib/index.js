
const http = require('http')
    , inherits = require('inherits')
    , EE = require('events').EventEmitter
    , decorate = require('./res-haiku')
    , fs = require('graceful-fs')
    , powerwalk = require('powerwalk')
    , through2 = require('through2')
    , path = require('path')
    , page = require('./page')
    , bunyan = require('bunyan')

module.exports = function(){
  var options = {}
  // Argument scrubbing for deciding how to return
  // NOTE: it might be better to break res-haiku into it's own module
  for (var i = 0; i < arguments.length; i ++){
    var arg = arguments[i]
    switch (arg.constructor) {
      case http.IncomingMessage:
        var req = arg
        break
      case http.ServerResponse:
        var res = arg
        break
      case String:
        options = { src: arg }
        break
      case Object:
        options = arg
        break
    }
  }

  var haiku = new Haiku(options)

  if (req && res) return decorate(req, res, haiku)
  else return haiku
}

module.exports.ctor = Haiku

/*

* new
* reading
* read

*/

function Haiku(options){
  var haiku = this
    , options = options || {}

  EE.call(haiku)
  haiku.setMaxListeners(Infinity)

  haiku.state = 'new'
  haiku.entities = {}
  haiku._transforms = []

  if (options['log-level']) {
    haiku.logger =  bunyan.createLogger({ name: 'haiku' })
  } else {
    haiku.logger = {}
    var levels = [ 'fatal'
        , 'error'
        , 'warn'
        , 'info'
        , 'debug'
        , 'trace'
        ]

    levels.forEach(function(level){ haiku.logger[level] = noop })
  }

  haiku.on('reading', function(){ haiku.state = 'reading' })
  haiku.on('read',    function(){ haiku.state = 'read'    })

  haiku.configure(options)
}

inherits(Haiku, EE)

Haiku.prototype.is = function(state){
  return this.state === state
}

Haiku.prototype.set = function(key, value, callback){
  var haiku = this
    , log = haiku.logger

  log.info('setting: %s', key)

  haiku.entities[key] = value

  process.nextTick(function(){
    callback(null, value)
  })
}

Haiku.prototype.get = function(key, callback){
  var haiku = this
    , args = Array.prototype.slice.call(arguments)

  if (haiku.is('new')) haiku.read()
  if (haiku.is('new') || haiku.is('reading')) return defer()

  // find by url
  var page = haiku.entities[key]

  // no results? check for an index or a name
  if (! page) Object.keys(haiku.entities).forEach(function(url){
    var _page = haiku.entities[url]

    if (_page.url() === path.join(key, 'index.html')) page = _page
    if (_page.name() === key) page = _page
  })

  callback(null, page)

  function defer(){
    haiku.once('read', function(){
      haiku.get.apply(haiku, args)
    })
  }
}

// Mostly for helping with the tests
Haiku.prototype.render = function(key, context, callback){
  var haiku = this

  // Note, there has to be some kind of module that handles this.
  for (var i = 0; i < arguments.length; i ++){
    var arg = arguments[i]
    switch (typeof arg) {
      case 'string':
        key = arg
        break
      case 'function':
        callback = arg
        break
      case 'object':
        context = arg
        break
    }
  }

  if (! context) context = {}

  haiku.get(key, function(err, page){
    page.render(context, callback)
  })
}

Haiku.prototype.read = function(){
  var haiku = this
    , content = haiku.opt('content-dir')
    , stream = through2({ objectMode: true }, write, flush)
    , log = haiku.logger

  haiku.emit('reading')

  fs.exists(content, function(exists){
    if (! exists) {
      log.warn('%s does not exist', haiku.opt('content-dir'))
      return haiku.emit('read')
    }

    log.info('walking: %s', haiku.opt('content-dir'))

    powerwalk(haiku.opt('content-dir'))
    .pipe(stream)
    .on('error', function(err){ haiku.emit('error', err) })
  })

  return stream

  function write(chunk, enc, callback){
    var file = chunk.toString()

    log.info('reading file: %s', file)

    // TODO: make page.read() streaming?
    page(file, haiku)
    .read(function(err, entity){
      if (err) return callback(err)

      haiku.set(entity.url(), entity, function(err){
        if (err) return callback(err)
        stream.push(entity)
        callback()
      })
    })
  }

  function flush(){
    log.info('done reading')
    haiku.emit('read')
  }
}

Haiku.prototype.opt = function(option, value){
  var haiku = this

  if (! haiku.options) haiku.options = {}

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
    if (o === 'src' && ! value && ! haiku.options[o]) return process.cwd()

    if (v) return haiku.options[o] = path.resolve(haiku.opt('src'), v)
    else return haiku.options[o] || path.resolve(haiku.opt('src'), name)
  }

  return haiku
}

Haiku.prototype.configure = function(options){
  var haiku = this

  Object.keys(options).forEach(function(key){
    haiku.opt(key, options[key])
  })

  return haiku
}

Haiku.prototype.transform = function(fn){
  var haiku = this

  haiku._transforms.push(fn)

  return haiku
}



function noop(){}
