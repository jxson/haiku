
const fs = require('graceful-fs')
const path = require('path')
const page = require('./page')
const debug = require('debug')('read')

module.exports = read

function read(filename, basedir, baseurl, callback) {
  if (arguments.length === 3) {
    callback = baseurl
    baseurl = '/'
  }

  var p = page(filename, basedir, baseurl)

  fs.stat(filename, function(err, stats) {
    if (err) return callback(err)

    p.set('stats', stats)

    fs.readFile(filename, 'utf8', function(err, data) {
      if (err) callback(err)
      else callback(null, p.set('data', data))
    })
  })
}
