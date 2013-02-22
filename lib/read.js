
module.exports = read

var walk = require('./utils/walk')

  , colors = require('colors')


function read(name, callback){
  var haiku = this

  // name might be a url or name of file relative to content with or
  // without the extension
  if (typeof name === 'function') {
    callback = name
    name = ''
  }

  // if no url read everything
  // if a callback is provided use it
  // otherwise emit

  walk(haiku['content-dir'])
  .on('file', function(file){
    haiku.pages.push(file)

    console.log('file'.grey, file.path)
  })
  .on('end', function(){
    console.log('Done reading!'.green)

    haiku.emit('content')
  })
}
