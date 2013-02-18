
var http = require('http')
  , haiku = require('../../lib')
  , path = require('path')
  , opts = { root: path.resolve(__dirname, '../fixtures/blog') }

module.exports = http.createServer(function(req, res){
  res.haiku = haiku.handler(req, res, opts)

  res.haiku(req.url)
})

var _listen = module.exports.listen

// Wrap the http listener so that it wont fire until the content is
// read in. This is a little hacky, ideally this behavior should be
// handled in a different manner in your code.
module.exports.listen = function(){
  var args = arguments

  haiku
  .on('content', function(){
    _listen.apply(module.exports, args)
  })
  .read('content')
}
