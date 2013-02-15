
var http = require('http')
  , haiku = require('../../lib')

module.exports = http.createServer(function(req, res){
  res.haiku = haiku.handler(req, res, opts)

  res.haiku(req.url)
})

