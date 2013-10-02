
const http = require('http')
    , inherits = require('inherits')
    , EE = require('events').EventEmitter
    , decorate = require('./res-haiku')
    , fs = require('graceful-fs')
    , powerwalk = require('powerwalk')
    , through2 = require('through2')
    , path = require('path')

module.exports = function(){
  var options = {}
  // Argument scrubbing for deciding how to return
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
  haiku.content = []

  haiku.on('reading', function(){ haiku.state = 'reading' })
  haiku.on('read',    function(){ haiku.state = 'read'    })

  haiku.configure(options)
}

inherits(Haiku, EE)

Haiku.prototype.is = function(state){
  return this.state === state
}

Haiku.prototype.get = function(url, callback){
  var haiku = this
    , args = Array.prototype.slice.call(arguments)

  if (haiku.is('new')) haiku.read()
  if (haiku.is('new') || haiku.is('reading')) return defer()

  callback()

  function defer(){
    haiku.once('read', function(){
      haiku.get.apply(haiku, args)
    })
  }
}

Haiku.prototype.read = function(){
  var haiku = this
    , content = haiku.opt('content-dir')
    , stream = through2(write)

  haiku.emit('reading')

  fs.exists(content, function(exists){
    if (! exists) {
      console.log('content-dir does not exist')
      return haiku.emit('read')
    }

    console.log('walking ', haiku.opt('content-dir'))

    powerwalk(haiku.opt('content-dir'))
    .pipe(stream)
    .on('end', function(){ haiku.emit('read') })
  })

  return stream

  function write(chunk, enc, callback){
    var file = chunk.toString()
    console.log('chunk', chunk)
    console.log('file', file)
    console.log('enc', enc)

    // TODO: make this streaming
    fs.readFile(file, function(err, data){
      if (err) return callback(err)

      var

    })
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
