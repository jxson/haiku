
var http = require('http')
  , haiku = require('../../')
  , path = require('path')
  , opts = { src: path.resolve(__dirname, '../fixtures/blog') }
  , server

module.exports = http.createServer(function(req, res){
  res.haiku = haiku.handler(req, res, opts)
  res.haiku(req.url)
})
