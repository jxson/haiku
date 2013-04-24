
var extend = require('util')._extend
  , EE = require('events').EventEmitter
  , assert = require('assert')
  , path = require('path')
  , bunyan = require('bunyan')

module.exports = createHaiku

function createHaiku(src, options){
  var haiku = Object.create({ configure: configure
      , read: read
      , add: add
      , opt: opt
      , find: find
      , get: get
      , end: end
      , createResponseHandler: createResponseHandler
      }, { logger: { value: false, writable: true }
      , pages: { value: [], enumerable: true, writable: true }
      , opts: { value: {}, writable: true, enumerable: false }
      , context: { get: context }
      , _context: { value: {}, writable: true }
      , isReading: { value: true, writable: true }
      })

  var req
    , res
    , src

  for (var i = 0; i < arguments.length; i ++){
    var arg = arguments[i]

    if (arg instanceof require('http').IncomingMessage) req = arg
    if (arg instanceof require('http').ServerResponse) res = arg
    if (typeof arg === 'string') src = arg
  }

  options = getOptions(arguments)

  // https://gist.github.com/davidaurelio/838778
  extend(haiku, EE.prototype)

  haiku.configure(options)

  // NOTE: there should be a better way to do this like pooling async
  // stuff until the read happens
  process.nextTick(function(){
    haiku.read()
  })

  if (req && res) return haiku.createResponseHandler(req, res)
  else return haiku

  function getOptions(args){
    var last = args[args.length - 1]
      , opts = typeof last === 'object'
        && (last !== req || last !== req) ? last : {}

    if (typeof src === 'string') opts.src = src

    return opts
  }
}

function createResponseHandler(req, res){
  var haiku = this

  return function handler(url, ctx, code){
    var ctx = ctx || {}
      , code = code || 200

    haiku.get(url, function(err, page){
      if (err) throw err
      if (! page) return notFound()

      page.render(ctx, function(err, output){
        if (err) throw err

        var buffer = require('buffer').Buffer
          , data = Buffer(output)

        res.statusCode = 200
        res.setHeader('content-length', data.length)
        res.end(data)
      })
    })
  }

  function notFound(){
    res.setHeader('content-type', 'text/plain')
    res.statusCode = 404
    res.write('a blank page stares back\n')
    res.write('this entity is missing\n')
    res.write('but there are others\n')
    res.end()
  }
}

function get(name, callback){
  var haiku = this

  if (haiku.isReading) {
    haiku.once('error', callback)
    haiku.once('end', function(){
      callback(null, haiku.find(name))
    })
  } else process.nextTick(function(){
    callback(null, haiku.find(name))
  })
}

function configure(options){
  var haiku = this

  Object.keys(options).forEach(function(key){
    haiku.opt(key, options[key])
  })

  // TODO: move this out to the CLI in case people use the API direclty
  // and don't want the logs
  //
  // * https://github.com/jxson/haiku/issues/64
  //
  if (! haiku.logger) {
    haiku.logger = bunyan.createLogger({name: 'haiku'
    , level: haiku.opt('log-level')
    })
  }

  if (haiku.logger.level() !== haiku.opt('log-level')) {
    haiku.logger.level(haiku.opt('log-level'))
  }

  return haiku
}

// A dumb getter/ setter function for haiku.options. Using normal ES5
// getters and setters seemed weird since directory paths etc were
// getting normalized/ mutated
function opt(option, value){
  var haiku = this

  switch (option) {
    case 'src'          : return dir('src', value)
    case 'content-dir'  : return dir('content', value)
    case 'build-dir'    : return dir('build', value)
    case 'templates-dir': return dir('templates', value)
    case 'public-dir'   : return dir('public', value)
    case 'log-level'    :
      if (value)  return haiku.opts[option] = value
      else        return haiku.opts[option] || 'warn'
      break;
  }

  function dir(name, v){
    var o = name === 'src' ? name : name + '-dir'
    if (o === 'src' && ! value && !haiku.opts[o]) return process.cwd()

    if (v) return haiku.opts[o] = path.resolve(haiku.opt('src'), v)
    else return haiku.opts[o] || path.resolve(haiku.opt('src'), name)
  }
}

function find(name){
  // trailing slash? It's an index
  name = name.replace(/\/$/, '/index.html')

  var filtered = this.pages.filter(filter)

  return filtered.length ? filtered[0] : null

  function filter(page){
    return page.name === name || page.url === name
  }
}

// TODO: Make this private maybe
function read(callback){
  var haiku = this
    , powerwalk = require('powerwalk')

  if (callback) {
    haiku.once('error', callback)
    haiku.once('end', function(){ callback(null) })
  }

  haiku.isReading = true

  powerwalk(haiku.opt('content-dir'))
  .on('error', function(err){ haiku.emit('error', err) })
  .on('read', function(file){ haiku.add(file) })
  .on('end', finish)

  return haiku

  function finish(){
    haiku.logger.debug('finished walking')
    haiku.isReading = false
    haiku.emit('end')
  }
}

function end(callback){
  var haiku = this

  haiku.once('error', callback)
  haiku.once('end', callback)

  return haiku
}

function add(file){
  var haiku = this
    , pagify = require('./pagify')
    , page = pagify(file, haiku)

  // add keys for each page to support page sections
  // Object.defineProperty(haiku.context, page.name, { value: page })

  // stash the page for later
  haiku.pages.push(page)

  haiku.logger.debug('Added page')

  return page
}

// Returns the haiku context for rendering, this could be optimized
// since this will be called everytime a page is rendered
function context(){
  var haiku = this
    , ctx = { pages: haiku.pages }

  haiku.pages.forEach(function(page){
    var parent = ctx
      , keys = page.collection.split('.')

    keys.forEach(function(key){
      var isLast = key === keys[keys.length - 1]
        , isNotAnIndexPage = ! path.basename(page.url).match(/^index/)

      if (! parent[key]) {
        // Define a key on the pre-defined array, this is what makes our
        // magic mustache keys work
        Object.defineProperty(parent, key, { value: []
        , writable: true
        , enumerable: true
        })
      }

      if (isLast && isNotAnIndexPage) {
        parent[key].push(page.context)

        parent[key].sort(function(a, b){
          var aHasDate = !!a.date
            , bHasDate = !!b.date

          if (aHasDate && bHasDate) {
            return a.date.getTime() > b.date.getTime() ? 1 : -1
          }

          return a.name > b.name ? 1 : -1
        })

      }

      parent = parent[key]
    })
  })

  return ctx
}
