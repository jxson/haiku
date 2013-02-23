
module.exports = read

var walk = require('./utils/walk')
  , pagify = require('./pagify')

  , colors = require('colors')


function read(name, callback){
  var haiku = this

  // name might be a url or name of file relative to content with or
  // without the extension
  if (typeof name === 'function') {
    callback = name
    name = undefined
  }

  // if no url read everything
  // if a callback is provided use it
  // otherwise emit

  walk(haiku['content-dir'])
  .on('file', function(file){
    var page = pagify(file, haiku)

    haiku.pages[page.url] = page
  })
  .on('end', function(){
    haiku.emit('content')

    if (! name) return callback()
    else {
      var match

      Object.keys(haiku.pages).forEach(function(url){
        if (haiku.pages[url].name === name) {
          return match = haiku.pages[url]
        }
      })

      if (match) return callback(null, match)
    }
  })
}
