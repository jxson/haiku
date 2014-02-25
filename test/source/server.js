
const haiku = require('../../lib/res-haiku')
    , http = require('http')
    , path = require('path')
    , src = path.resolve(__dirname)

module.exports = http.createServer(function(req, res){
  res.haiku = haiku(req, res, src)
  res.haiku(req.url)
})
