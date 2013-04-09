
var extend = require('util')._extend
  , EE = require('events').EventEmitter
  , rimraf = require('rimraf')
  , assert = require('assert')
  , path = require('path')
  , bunyan = require('bunyan')

module.exports = function(src, options){
  var haiku = Object.create({ configure: configure
      , read: read
      , build: build
      , add: add
      }, { logger: { value: false, writable: true }
      , pages: { value: [], enumerable: true, writable: true }
      , options: { value: {
          set src(src) { this._src = path.resolve(src) }
        , get src() { return this._src || process.cwd() }
        , 'content-dir': 'content'
        , 'build-dir': 'build'
        , 'templates-dir': 'templates'
        , 'public-dir': 'public'
        , 'log-level': 'warn'
        }, writable: true } })

  // https://gist.github.com/davidaurelio/838778
  extend(haiku, EE.prototype)

  if (options) haiku.configure(options)

  return haiku
}

function configure(options){
  var haiku = this

  Object.keys(options).forEach(function(key){
    if (haiku.options.hasOwnProperty(key)) {
      haiku.options[key] = options[key]
    }
  })

  // TODO: move this out to the CLI in case people use the API direclty
  // and don't want the logs
  if (! haiku.logger) {
    haiku.logger = bunyan.createLogger({name: 'haiku'
    , level: haiku.options['log-level']
    })
  }

  if (haiku.logger.level() !== haiku.options['log-level']) {
    haiku.logger.level(haiku.options['log-level'])
  }

  return haiku
}

function read(){
  var haiku = this
    , powerwalk = require('powerwalk')
    , content = path.resolve(haiku.options.src, haiku.options['content-dir'])

  powerwalk(content)
  .on('error', function(err){
    haiku.emit('error', err)
  })
  .on('read', function(file){
    haiku.add(file)
  })
  .on('end', finish)

  function finish(){
    haiku.logger.debug('finished walking')

    haiku.emit('end')
  }
}

function build(){
  var haiku = this
    , build = path.resolve(haiku.options.src, haiku.options['build-dir'])

  haiku.logger.debug('starting build')
  haiku.logger.info('removing --build-dir %s', build)

  rimraf(build, function(err){
    if (err) return haiku.emit(err)

    haiku
    .on('end', function(){
      haiku.pages.forEach(function(page){
        page.build(function(err, built){
          if (err) return haiku.emit('error', err)
          else return finish()
        })
      })
    })
    .read()
  })

  var counter = 0

  function finish(){
    counter++

    if (counter === haiku.pages.length) {
      haiku.logger.info('finished building')
    }
  }
}

function add(file){
  var haiku = this
    , pagify = require('./pagify')
    , page = pagify(file, haiku)

  // TODO: gaurd that this doesn't override haiku methods!!!
  //
  // Adds keys for the template data
  if (! haiku[page.dirname]) haiku[page.dirname] = []

  // don't add indexes to the list
  if (! path.basename(page.url).match(/^index/)) {
    haiku[page.dirname].push(page)
  }

  // add keys for each page to support page sections
  // NOTE: has to use a key with the extension removed
  // TODO: make this a little more robust
  var key = path.join('content', page.name.replace(path.extname(page.name), ''))

  if (! haiku[key]) haiku[key] = page

  haiku.pages.push(page)

  haiku.logger.debug('Added page')

  return page
}
