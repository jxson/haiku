
var path = require('path')

module.exports = function(filename, haiku){
  return new Page(filename, haiku)
}

function Page(filename, haiku){
  var page = this
    , assert = require('assert')

  assert.ok(haiku, 'Page requires a haiku instance')

  page.haiku = haiku
  page.filename = filename
  page.name = name(filename, haiku)
  page.url = url(filename, haiku)
  page.dirname = dirname(filename, haiku)
}

// TODO: get this to cache based on stats when using the options.watch
Page.prototype.read = function(callback){
  var page = this
    , fs = require('graceful-fs')
    , fm = require('front-matter')

  fs.readFile(page.filename, 'utf8', function(err, data){
    if (err) return callback(err)

    // page.data = data // This is only needed for debugging
    page.meta = fm(data).attributes
    page.body = fm(data).body
    page.context = {}

    callback()
  })
}

// utility functions

// Extract the name from a file
function name(filename, haiku){
  return filename
  // remove the content-dir
  .replace(haiku.opt('content-dir'), '')
  // trim leading slash
  .replace(new RegExp('^' + path.sep), '')
}


function dirname(filename, haiku){
  var path = require('path')

  return path
  .relative(haiku.opt('src'), path.dirname(filename))
}

function url(filename, haiku){
  var name = filename.replace(haiku.opt('content-dir'), '')
    , mime = require('mime')
    , path = require('path')
    , type = mime.lookup(name)
    , extension = path.extname(filename)
    , _url = name

  if (type === 'text/x-markdown') {
    _url = name.replace(extension, '.html')
  }

  return _url
}
