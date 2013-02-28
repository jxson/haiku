
var beardo = require('beardo')
  , path = require('path')
  , fs = require('graceful-fs')
  , fm = require('front-matter')
  , _index = 'index.html'
  , extensions = { '.md': '.html'
    , '.markdown': '.html'
    , '.mdown': ".html"
    , '.mustache': '.html'
    , '.mkdn': '.html'
    , '.mkd': '.html'
    }

module.exports = pagify

// This should extend the event emitter
function pagify(attrs, haiku){
  Object.defineProperties(attrs, {
    url: { enumerable: true
    , get: url
    }
  // , render: { enumerable: true
  //   , value: render
  //   }
  // , attributes: { enumerable: true
  //   , get: function(){ return fm(this.data).attributes }
  //   }
  // , body: { enumerable: true
  //   , get: function(){ return fm(this.data).body }
  //   }
  , read: { enumerable: true
    , value: read
    }
  , name: { enumerable: true
    , get: name
    }
  })

  attrs.haiku = haiku

  return attrs
}

function url(){
  var page = this
    , haiku = page.haiku
    , uri = page.path.replace(haiku['content-dir'], '')

  Object.keys(extensions).forEach(function(extension){
    // TODO: stop looping if an extension matches
    uri = uri.replace(extension, extensions[extension])
  })

  return uri
}

function name(){
  var page = this
    , haiku = page.haiku

  return page
  .path
  .replace(haiku['content-dir'], '')
  .replace(/^\//, '') // trims leading slash, should use path.sep
}

function read(callback){
  var page = this

  // TODO: stat and cache
  fs.stat(page.path, function(err, stats){
    if (err) return callback(err)

    page.stats = stats

    fs.readFile(page.path, 'utf8', function(err, data){
      if (err) return callback(err)

      page.data = data

      callback()
    })
  })
}

// function read(path, callback){
//   var path = require('path').resolve(__dirname, path)
//     , attrs = { path: path }
//
//   fs.stat(path, function(err, stats){
//     if (err) return callback(err)
//
//     attrs.stats = stats
//
//     fs.readFile(path, 'utf8', function(err, data){
//       if (err) return callback(err)
//
//       attrs.data = data
//
//       callback(null, attrs)
//     })
//   })
// }