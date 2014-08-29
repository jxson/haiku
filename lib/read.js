
const fs = require('graceful-fs')
const path = require('path')
const page = require('./page')
const parallel = require('run-parallel')

module.exports = read

function read(filename, basedir, callback) {
  var p = page(filename, basedir)

  fs.stat(filename, function(err, stats) {
    if (err) return callback(err)

    p.set('stats', stats)

    fs.readFile(filename, 'utf8', function(err, data) {
      if (err) callback(err)
      else callback(null, p.set('data', data))
    })
  })
}
