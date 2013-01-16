
var haiku = {}
  , http = require('http')

haiku.server = function(options){
  var server = http.createServer()

  server.on('request', onRequest)

  return server
}

module.exports = haiku

function onRequest(req, res){
  res.writeHead(200, {'content-type': 'text/plain'})

  var lines = [ 'old pond...'
      , 'a frog leaps in'
      , 'water\'s sound'
      ]

  lines.forEach(function(line){
    res.write(line)
    res.write('\n')
  })

  res.end()
}
