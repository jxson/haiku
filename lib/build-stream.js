
const through2 = require('through2')
    , mkdirp = require('mkdirp')
    , path = require('path')
    , fs = require('graceful-fs')

module.exports = createBuildStream

function createBuildStream(haiku){
  var buildstream = through2.obj(write)

  return buildstream

  function write(page, enc, callback){
    var dirname = path.dirname(page.out)

    mkdirp(dirname, function(err, made){
      if (err) return callback(err)

      haiku.render(page, function(err, output){
        if (err) return callback(err)

        fs.writeFile(page.out, output, function(err){
          if (err) return callback(err)
          buildstream.push(page)
          callback()
        })
      })
    })
  }
}
