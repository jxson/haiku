
module.exports = function(src, options){
  // Decorating req, res objects?
  var req
    , res

  for (var i = 0; i < arguments.length; i ++){
    var arg = arguments[i]
      , isLast

    if (arg instanceof require('http').IncomingMessage) req = arg
    if (arg instanceof require('http').ServerResponse) res = arg
    if (typeof arg === 'string') src = arg
  }

  // assign options, the last arg that isn't a req, res, or string
  var last = arguments[arguments.length - 1]
    , isObject = typeof last === 'object'
    , isNotDecorating = (last !== req || last !== req)
    , options = isObject && isNotDecorating ? last : {}

  if (src) options.src = src

  // Okay, time to stop messing around
  var haiku = new Haiku(options)

  // TODO: if there is a req, res return the decorator

  // Start reading the content after the return
  process.nextTick(function(){
    haiku.read()
  })

  return haiku
}

var EE = require('events').EventEmitter

function Haiku(options){
  var haiku = this

  // setup
  haiku.pages = [] // This might be unnessecary...
  haiku.queue = []
  haiku.isReading = false
  haiku.isWatching = false
  haiku.opts = {}

  haiku.configure(options)
}

// Inherit from Event Emitter
Haiku.prototype.__proto__ = EE.prototype

Haiku.prototype.configure = function(options){
  var haiku = this

  Object.keys(options).forEach(function(key){
    haiku.opt(key, options[key])
  })

  return haiku
}

Haiku.prototype.opt = function(option, value){
  var haiku = this
    , path = require('path')

  switch (option) {
    case 'src'          : return dir('src', value)
    case 'content-dir'  : return dir('content', value)
    case 'build-dir'    : return dir('build', value)
    case 'templates-dir': return dir('templates', value)
    case 'public-dir'   : return dir('public', value)
  }

  function dir(name, v){
    var o = name === 'src' ? name : name + '-dir'

    // if asking for the src and it's not defined default to process.cwd()
    if (o === 'src' && ! value && ! haiku.opts[o]) return process.cwd()

    if (v) return haiku.opts[o] = path.resolve(haiku.opt('src'), v)
    else return haiku.opts[o] || path.resolve(haiku.opt('src'), name)
  }

  return haiku
}

// Async content finder
Haiku.prototype.find = function(name, callback){
  var haiku = this
    , name = name
    , isArray = typeof name === 'array'

  // It's possible to call this before the read has happened, this check
  // prevents race conditions
  if (haiku.isReading) {
    haiku.once('error', callback)
    haiku.once('end', _find)
  } else process.nextTick(_find)

  function _find(){
    if (isArray) findOne()
    else findMany()
  }

  function findOne(){
    // trailing slash? It's probably an index
    // NOTE: it might be better to not do this and require proper linking
    // since when things get compiled to static assets thats what will be used
    var _name = name.replace(/\/$/, '/index.html')
      , results = haiku.pages.filter(filter)

    return callback(null, results[0])

    function filter(page){
      return page.name === _name || page.url === _name
    }
  }

  // Only works on names, doesn't check urls.
  // This should only be used in tests...
  function findMany(){
    var names = name
      , array = haiku.pages.filter(filter)
      , results = {}

    array.forEach(function(page){
      results[page.name] = page
    })

    return callback(null, results)

    function filter(page){
      return names.indexOf(page.name) >= 0
    }
  }

}


Haiku.prototype.read = function(){
  var haiku = this
    , powerwalk = require('powerwalk')

  haiku.isReading = true

  powerwalk(haiku.opt('content-dir'))
  .on('error', function(err){ haiku.emit('error', err) })
  .on('file', add)

  function add(filename){
    var pager = require('./pager')
      , page = pager(filename, haiku)

    haiku.queue.push(page.name)
    haiku.pages.push(page)

    page.read(function(err){
      if (err) return haiku.emit('error', err)

      // remove this page from the queue
      var index = haiku.queue.indexOf(this.name)

      haiku.queue.splice(index, 1)

      // if it's the last page fire the end event
      // TODO: handle this differently when options.watch becomes a thing
      if (haiku.queue.length === 0) {
        haiku.isReading = false
        haiku.context = context(haiku.pages)
        haiku.emit('end')
      }
    })
  }
}

function context(pages){
  var ctx = {}
    , path = require('path')

  pages.forEach(function(page){
    var parent = ctx
      , keys = page.dirname.split(path.sep)

    keys.forEach(function(key){
      var isLast = key === keys[keys.length - 1]
        , isNotAnIndex = ! path.basename(page.url).match(/^index/)
        , isNotADraft = !!page.meta.draft === false

      // This defines a property on the collection that is the next collection.
      // Hacky, but it allows chains in mustache {{#foo.bar.baz}} which is nice
      if (! parent[key]) parent[key] = []

      // if we are done messing around add the page's context to the collection
      if (isLast && isNotADraft && isNotAnIndex) {
        parent[key].push(page.context)

        // sort the thing
        parent[key].sort(function(a, b){
          var aHasDate = !!a.date
            , bHasDate = !!b.date

          if (aHasDate && bHasDate) {
            return a.date.getTime() > b.date.getTime() ? 1 : -1
          }

          return a.name > b.name ? 1 : -1
        })
      }

      // bubble the parent to the next key
      parent = parent[key]
    }) // keys.forEach(...)

  }) // pages.forEach(...)

  return ctx
}