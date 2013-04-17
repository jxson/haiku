
var path = require('path')
  , fs = require('graceful-fs')

module.exports = reader

function reader(opts){
  var cwd = path.normalize(opts.cwd)
    , build = opts.build || 'build'

  return function(url, cb){
    var file =path.join(cwd, build, url)

    fs.readFile(file, 'utf8', cb)
  }
}
