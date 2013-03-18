
var path = require('path')
  , mkdirp = require('mkdirp')
  , EE = require('events').EventEmitter
  , extend = require('util')._extend
  , walk = require('./walk')
  , fs = require('graceful-fs')
  , fm = require('front-matter')
  , marked = require('marked')
  , hogan = require('hogan.js')
  , beardo = require('beardo')
  , extensions = { '.md': '.html'
    , '.markdown': '.html'
    , '.mdown': ".html"
    , '.mustache': '.html'
    , '.mkdn': '.html'
    , '.mkd': '.html'
    }

  , colors = require('colors')

module.exports = Object.create({ configure: configure
, reset: reset
, read: read
, walk: walk
, add: add
}, {
  opts: { value: {}
  , writabale: true
  }
, pages: { value: [], enumerable: true, writable: true }
, defaults: {
    value: { 'root': process.cwd()
    , 'content-dir': 'content'
    , 'build-dir': 'build'
    , 'templates-dir': 'templates'
    , 'log-level': 'warn'
    }
  }
, root: {
    set: function(root){ this.opts.root = path.resolve(root) }
  , get: function(){ return this.opts.root || this.defaults.root }
  }
, 'log-level': {
    set: function(level){ this.opts['log-level'] = level }
  , get: function(){ return this.opts['log-level'] || this.defaults['log-level'] }
  }
, 'content-dir': {
    set: function(dir){
      return this.opts['content-dir'] = path.resolve(dir)
    }
  , get: function(){
      if (this.opts['content-dir']) return this.opts['content-dir']
      else return path.join(this.root, this.defaults['content-dir'])
    }
  }
, 'build-dir': {
    set: function(dir){
      return this.opts['build-dir'] = path.resolve(dir)
    }
  , get: function(){
      if (this.opts['build-dir']) return this.opts['build-dir']
      else return path.join(this.root, this.defaults['build-dir'])
    }
  }
})

// https://gist.github.com/davidaurelio/838778
extend(module.exports, EE.prototype)

// # haiku.configure(options)
//
// Provides a way to quickly define a set of configurable options.
function configure(options){
  var haiku = this

  Object.keys(options).forEach(function(key){
    if (haiku.hasOwnProperty(key)) haiku[key] = options[key]
  })

  return haiku
}

// # haiku.reset()
//
// Mostly for resetting haiku's configuration between test runs
function reset(){
  this.opts = {}
}

// There should be a gaurd around reading so if read is called more
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

  // GAH: haiku needs to get reset on each read or have a way to track
  // the state of the watched dirs
  //
  // haiku.content = []

  var colors = require('colors')

  walk(haiku['content-dir'])
  .on('error', function(err){
    haiku.emit('error', err)
  })
  .on('file', function(file){ haiku.add(file) })
  .on('end', function(){
    console.log('walks over'.green)
    console.log('reading'.yellow)

    var queue = []

    haiku.pages.forEach(function(page){
      queue.push(page.file)

      page.read(finish)
    })

    function finish(err){
      if (err) return callback(err)

      var page = this

      queue.splice(queue.indexOf(page.file), 1)

      if (queue.length === 0) haiku.emit('end')
    }

    // haiku.pages.forEach(haiku.write)

    //   // // orginize the content
    //   // haiku.emit('content')
    //
    //   if (! name) return callback()
    //   else {
    //     var match
    //
    //     Object.keys(haiku.pages).forEach(function(url){
    //       if (haiku.pages[url].name === name) {
    //         return match = haiku.pages[url]
    //       }
    //     })
    //
    //     if (match) return callback(null, match)
    //   }
  })
}

function add(file){
  // console.log('adding file:'.yellow, file)

  var haiku = this
    , props = { name: { get: name }
      // make these source && destination
      , file: { value: file }
      , destination: { get: function(){ return path.join(haiku['build-dir'], this.url) } }
      , dirname: { get: dirname }
      , url: { get: url }
      , stats: { value: {}, writable: true }
      , data: { value: '', writable: true }
      , body: { get: function(){ return fm(this.data).body } }
      , meta: { get: function(){ return fm(this.data).attributes } }
      }
    , page = Object.create({ read: read
      , write: write
      , render: render
      }, props)

  // TODO: gaurd that this doesn't override haiku methods!!!
  if (! haiku[page.dirname]) haiku[page.dirname] = []

  haiku[page.dirname].push(page)
  haiku.pages.push(page)

  return page

  function name(){
    var page = this

    return page
    .file
    .replace(haiku['content-dir'], '')
    .replace(/^\//, '') // trims leading slash, should use path.sep
  }

  function dirname(){
    return this
    .file
    .replace(haiku['root'], '')
    .replace(path.basename(this.file), '')
    .replace(/^\//, '') // trims leading slash, should use path.sep
    .replace(/\/$/, '') // trims trailing slash, should use path.sep
  }

  function url(){
    var page = this
      , uri = page.file.replace(haiku['content-dir'], '')

    Object.keys(extensions).forEach(function(extension){
      // TODO: stop looping if an extension matches
      uri = uri.replace(extension, extensions[extension])
    })

    return uri
  }

  function read(cb){
    var page = this

    // TODO: base cahcing off stat calls
    fs.stat(page.file, function(err, stats){
      if (err) return cb(err)

      // console.log('stated', page.name)

      page.stats = stats

      fs.readFile(page.file, 'utf8', function(err, data){
        if (err) return cb(err)

        // console.log('read', page.name)

        page.data = data

        // TODO: don't overwrite methods/ properties, maybe pull this
        // into the data setter, also needs to remove old values
        Object.keys(page.meta).forEach(function(k){
          page[k] = page.meta[k]
        })

        cb(null)
      })
    })
  }

  function write(cb){
    var page = this

    page.render(function(err, out){
      mkdirp(path.dirname(page.destination), function(err, made){
        if (err) return callback(err)

        fs.writeFile(page.destination, out, function(err){
          if (err) return cb(err)
          // console.log('wrote:'.green, page.destination)
          cb()
        })
      })

    })
  }

  function render(context, callback){
    var page = this
      , context = context || {}
      // This might be pulled into beardo, also an expensive operation
      // think about caching it
      // NOTE: this has to happen after everything has been read
      , mustached = hogan.compile(page.body).render(haiku)
      , MD = marked(mustached)
      , template = beardo.add(page.name, MD)

    if (typeof context === 'function') {
      callback = context
      context = {}
    }

    // tell beardo wheres what
    beardo.directory = path.join(haiku.root, 'templates')

    // ???: beardo needs a way to distinguish templates that need reading vs
    // ones that were added manually

    beardo.render(page.name, haiku, callback)
  }
}
