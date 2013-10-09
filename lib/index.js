
const http = require('http')
    , inherits = require('inherits')
    , EE = require('events').EventEmitter
    , decorate = require('./res-haiku')
    , fs = require('graceful-fs')
    , powerwalk = require('powerwalk')
    , through2 = require('through2')
    , path = require('path')
    , entity = require('./entity')
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

Haiku.prototype.set = function(entity){
  this.entities[entity.url] = entity
}

Haiku.prototype.get = function(key, callback){
  var haiku = this
    , args = Array.prototype.slice.call(arguments)

  if (haiku.is('new')) haiku.read()
  if (haiku.is('new') || haiku.is('reading')) return defer()

  // Faking it for now
  callback()

  // find by url
  // no results? check for an index or a name

  function defer(){
    haiku.once('read', function(){
      haiku.get.apply(haiku, args)
    })
  }
}

Haiku.prototype.read = function(){
  var haiku = this
    , content = haiku.opt('content-dir')
    , stream = through2(write, flush)
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
    .on('error', function(){ haiku.emit('error') })
  })

  return stream

  function write(chunk, enc, callback){
    var file = chunk.toString()

    log.info('reading file: %s', file)

    // TODO: make this streaming?

    fs.readFile(file, 'utf8', function(err, data){
      log.info('read file: %s', file)
      if (err) return callback(err)
      haiku.set(entity(file, data, haiku))
      callback()
    })
  }

  function flush(){
    console.log('haiku', haiku)
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

function noop(){}
