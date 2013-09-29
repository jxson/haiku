
const http = require('http')
    , inherits = require('inherits')
    , EE = require('events').EventEmitter
    , decorate = require('./res-haiku')

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

function Haiku(options){
  var haiku = this
    , options = options || {}
}

inherits(Haiku, EE)

Haiku.prototype.get = function(url, callback){
  callback()
}
