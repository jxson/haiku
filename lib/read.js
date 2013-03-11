
var walk = require('./utils/walk')
  , pagify = require('./pagify')
  , path = require('path')

  , colors = require('colors')

module.exports = read

// There needs to be a gaurd around reading so if read is called more
// than once and is still pending it wont run again until it's done
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

  // GAH: haiku needs to get reset
  haiku.content = []

  walk(haiku['content-dir'])
  // .on('dir', function(dir){
  //   console.log('dir', dir)
  // })
  .on('file', function(file){
    var page = pagify(file, haiku)
      , dirname = path.dirname(page.name)
      , dir = dirname === '.' ? 'content' : dirname

    // careful that this doesn't override haiku methods!!!
    if (! haiku[dir]) haiku[dir] = []
    haiku[dir].push(page)

    haiku.pages[page.url] = page
  })
  .on('end', function(){
    // // orginize the content
    // haiku.emit('content')

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
