
var http = require('http')
  , haiku = require('../../lib')
  , path = require('path')
  , opts = { root: path.resolve(__dirname, '../fixtures/blog') }
  , server

module.exports = http.createServer(function(req, res){
  res.haiku = haiku.handler(req, res, opts)

  res.haiku(req.url)
})
