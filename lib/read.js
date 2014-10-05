
const fs = require('graceful-fs')
const path = require('path')
const page = require('./page')
const fm = require('front-matter')
const debug = require('debug')('haiku:read')
const extend = require('xtend')
const error = require('./formatted-error')

module.exports = read

function read(filename, basedir, baseurl, callback) {
  if (arguments.length === 3) {
    callback = baseurl
    baseurl = '/'
  }

  var p = page({
    filename: filename,
    basedir: basedir,
    baseurl: baseurl
  })

  fs.stat(filename, function(err, stats) {
    if (err) return callback(err)

    p.mtime = stats.mtime

    fs.readFile(filename, 'utf8', function(err, data) {
      if (err) return callback(err)

      ffffm(data, filename, function(err, extraction) {
        if (err) return callback(err)

        // TODO: move this into a method
        // page.meta = xtend(page.meta, extraction.attributes)
        // page.template = hogan.compile(extraction.body)
        p.meta = extend(page.meta, extraction.attributes)
        p.body = extraction.body || ''

        debug('extracted fm', extraction)

        callback(null, p)
      })
    })
  })
}

function ffffm(data, filename, callback) {
  var extraction
  var err

  try {
    extraction = fm(data)
  } catch (e) {
    err = error('error parsing %s', filename)

    // Map yaml-js parse error attributes unto the error for now
    // TODO: bake this into front-matter
    for (key in e) {
      if (e.hasOwnProperty(key) && key !== 'stack') err[key] = e[key]
    }
  }

  callback(err, extraction)
}
