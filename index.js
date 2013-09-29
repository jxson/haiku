
const http = require('http')

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

// haiku.set(url, entity)

// haiku.get(url, function(err, entity){
//   if (err) throw err

//   entity.render(function(err, out){
//     if (err) throw err

//     console.log('out', out)
//   })
// })

// self.reset
// self.read
// self.generate
// self.render
// self.cleanup
// self.write
