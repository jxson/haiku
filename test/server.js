
const haiku = require('../')
    , http = require('http')
    , path = require('path')

module.exports = http.createServer(function(req, res){
  var options = { src: path.resolve(__dirname, 'source') }

  res.haiku = haiku(req, res, options)
  res.haiku(req.url)
})
