
const prr = require('prr')
    , fs = require('graceful-fs')
    , path = require('path')
    , mime = require('mime')
    , fm = require('front-matter')

module.exports = read

function read(options, callback){
  return fs.readFile(options.src, 'utf8', onReadFile)

  function onReadFile(err, data){
    if (err) return callback(err)

    var extraction = fm(data)

    options.meta = extraction.attributes
    options.content = extraction.body

    Object.defineProperty(options, 'name', { get: name, enumerable: true })
    Object.defineProperty(options, 'mime', { get: _mime, enumerable: true })
    Object.defineProperty(options, 'is', { value: is, enumerable: true })
    Object.defineProperty(options, 'url', { get: url, enumerable: true })

    callback(null, options)
  }
}

function is(type){
  return mime.lookup(this.src) === type
}

// this needs some love
function _mime(){
  var page = this
    , override = page.meta['content-type']
    , converted = override || mime.lookup('.html')

  return page.is('text/x-markdown') ? converted : mime.lookup(page.src)
}

function name(){
  var page = this
    , src = page.src
    , contentDir = page['content-dir']

  return src.replace(contentDir, '')
}

function url(){
  var page = this
    , name = page.name
    , extension = path.extname(page.src)
    , translated = '.' + mime.extension(page.mime)

  return name.replace(extension, translated)
}

