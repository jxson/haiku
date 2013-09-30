
const http = require('http')
    , inherits = require('inherits')
    , EE = require('events').EventEmitter
    , decorate = require('./res-haiku')
    , fs = require('graceful-fs')
    , powerwalk = require('powerwalk')
    , through2 = require('through2')

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

  haiku.on('reading', function(){ haiku.state = 'reading' })
  haiku.on('read', function(){ haiku.state = 'read' })
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
    if (! exists) haiku.emit('read')
  })

  return stream
}
