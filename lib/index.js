
const assert = require('assert')
    , prr = require('prr')
    , path = require('path')
    , inherits = require('util').inherits
    , EE = require('events').EventEmitter
    , through2 = require('through2')
    , fs = require('graceful-fs')
    , powerwalk = require('powerwalk')
    , read = require('./page')
    , allowedopts = [ 'src'
      , 'content-dir'
      , 'build-dir'
      , 'templates-dir'
      , 'public-dir'
      , 'markdown'
      ]
    , templates = require('./templates')
    , marked = require('marked')

module.exports = function(options){
  return new Haiku(options)
}

module.exports.ctor = Haiku

/*

  states: new, reading, read
  events: error, reading, read

*/
function Haiku(options){
  var haiku = this

  options = options || {}

  // allow a single string opt to be the src
  //
  //    haiku('path/to/mysite.com')
  //
  if (typeof options === 'string') options = { src: options }

  prr(haiku, 'options', { src: options.src || process.cwd()
  , markdown: marked
  })
  prr(haiku, 'state', 'new', { writable: true })
  prr(haiku, 'entities', {})
  prr(haiku, 'transforms', [])

  // inherits from a basic EventEmitter below, make sure it's ctor gets called.
  EE.call(haiku)
  haiku.setMaxListeners(Infinity)

  haiku.on('reading', function(){ haiku.state = 'reading' })
  haiku.on('read',    function(){ haiku.state = 'read'    })

  // defaults
  // needs `haiku.options.src` defined ahead of calling `haiku.resolve()`
  allowedopts.forEach(function(opt){
    if (! opt.match('-dir')) return

    var dirname = opt.replace('-dir', '')
    haiku.options[opt] = haiku.resolve(dirname)
  })

  haiku.configure(options)

  // has to be defined after opts are configured
  prr(haiku, 'templates', templates(haiku.opt('templates-dir')), { writable: true })
}

// inherit from a basic EventEmitter
inherits(Haiku, EE)

// Helper for knowing the current state.
Haiku.prototype.is = function(state){
  return this.state === state
}

Haiku.prototype.opt = function(option, value){
  var haiku = this
    , getting = value === undefined
    , dirname = ! getting ? value.replace('-dir', '') : undefined

  assert.ok(isAllowed(option), '"' + option + '" is not a valid haiku option.')

  // If getting return the value for the requested option. Otherwise set it and
  // return the haiku instance.
  if (getting) return haiku.options[option]

  if (option === 'markdown') {
    console.log('markdown', value)
    haiku.options[option] = value
  }
  else haiku.options[option] = haiku.resolve(dirname)

  if (option === 'templates-dir') {
    // redefine templates instance
    prr(haiku, 'templates', templates(haiku.opt('templates-dir')))
  }

  return haiku
}

// Sets multiple opts at once
Haiku.prototype.configure = function(options){
  var haiku = this

  Object.keys(options).forEach(function(key){
    if (isAllowed(key)) haiku.opt(key, options[key])
  })

  return haiku
}

// Resolves a `dirname` against the haiku instances `src` option.
Haiku.prototype.resolve = function(dirname){
  var haiku = this
    , src = haiku.opt('src')

  return path.resolve(src, dirname)
}

Haiku.prototype.get = function(key, callback){
  var haiku = this
    , args = Array.prototype.slice.call(arguments)

  // it's possible to trigger an error while deferring the haiku.read() call.
  // be nice and pass back the error to the callback if there isn't already a
  // listener.
  if (haiku.listeners('error').length === 0) haiku.on('error', callback)

  if (haiku.is('new')) haiku.read()
  if (haiku.is('new') || haiku.is('reading')) return defer()

  var page = haiku.entities[key]

  // no results? check for an index or a name
  if (! page) Object.keys(haiku.entities).forEach(function(url){
    var _page = haiku.entities[url]

    if (_page.url === path.join(key, 'index.html')) page = _page
    if (_page.name === key) page = _page
  })

  callback(null, page)

  function defer(){
    haiku.once('read', function(){
      haiku.get.apply(haiku, args)
    })
  }
}

Haiku.prototype.set = function(key, value, callback){
  var haiku = this

  haiku.entities[key] = value

  process.nextTick(next)

  function next(){
    callback(null, value)
  }
}

// kick of async reading
Haiku.prototype.read = function(){
  var haiku = this
    , content = haiku.opt('content-dir')
    , stream = through2.obj(write, flush)

  haiku.emit('reading')

  fs.exists(content, onExist)

  return stream

  function onExist(exists){
    // TODO: warn in this case
    if (! exists) return haiku.emit('read')

    powerwalk(content)
    .pipe(stream)
    .on('error', function(err){ haiku.emit('error', err) })
  }

  function write(chunk, enc, callback){
    var options = { src: chunk.toString()
        , 'content-dir': haiku.opt('content-dir')
        }

    read(options, function(err, page){
      if (err) return callback(err)

      // set the template
      haiku.templates.set(page.name, page.content)

      haiku.set(page.url, page, function(err){
        if (err) return callback(err)

        stream.push(page)
        callback()
      })

    })
  }

  function flush(){
    // TODO: log done reading
    haiku.emit('read')
  }
}

/*

h.render('index.html', { flash: 'hi' }, function(error, output){

})

*/

Haiku.prototype.render = function(key, context, callback){
  var haiku = this

  if (typeof context === 'function') {
    callback = context
    context = {}
  }

  haiku.get(key, function(err, page){
    if (err) return callback(err)
    if (! page) return callback(new Error('Not Found - ' + key))

    // needs to render twice to account for markdown post page render
    // and pre layout render

    haiku
    .templates
    .render(page.name, context, function(err, output){
      if (err) return callback(err)

      var marked = haiku.opt('markdown')

      context['layout-content'] = marked(output)

      haiku
      .templates
      .render('layouts/default', context, function(err, output){
        if (err) return callback(err)
        callback.call(page, null, output)
      })
    })

  })
}

/////////// helpers

function isAllowed(option){
  return allowedopts.indexOf(option) >= 0
}


