
var beardo = require('beardo')
  , path = require('path')
  , fs = require('graceful-fs')
  , fm = require('front-matter')
  , marked = require('marked')
  , hogan = require('hogan.js')
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
  var meta = fm(attrs.data).attributes

  // This should get handled in the read module, since data reading is
  // happening in the walk util this is happening here instead.
  Object.keys(meta).forEach(function(key){
    attrs[key] = meta[key]
  })

  // Methods
  Object.defineProperties(attrs, {
    url: { enumerable: true
    , get: url
    }
  , render: { enumerable: true
    , value: render
    }
  , read: { enumerable: true
    , value: read
    }
  // This should probably be renamed
  , name: { enumerable: true
    , get: name
    }
  // this shoudl bark if data isn't available
  , body: { enumerable: true
    , get: function(){ return fm(this.data).body }
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

// this doesn't seem to get used
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

function render(context, callback){
  var page = this
    , haiku = this.haiku
    , context = context || {}
    , mustached = hogan.compile(page.body).render(haiku)
    , MD = marked(mustached)
    , template = beardo.add(page.name, MD)

  if (typeof context === 'function') {
    callback = context
    context = {}
  }

  console.log(('content from: ' + page.title).magenta)
  haiku.content.forEach(function(p){
    console.log('p.title', p.title)
  })

  // tell beardo wheres what
  beardo.directory = path.join(haiku.root, 'templates')

  // beardo needs a way to distinguish templates that need reading vs
  // ones that were added manually

  // Object.keys(page.meta).forEach(function(k){
  //   context[k] = page.meta[k]
  // })

  beardo.render(page.name, haiku, callback)
}
