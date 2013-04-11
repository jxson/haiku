
var extend = require('util')._extend
  , EE = require('events').EventEmitter
  , rimraf = require('rimraf')
  , assert = require('assert')
  , path = require('path')
  , bunyan = require('bunyan')

module.exports = function(src, options){
  var options = options || {}
    , haiku = Object.create({ configure: configure
      , read: read
      , build: build
      , add: add
      , opt: opt
      }, { logger: { value: false, writable: true }
      , pages: { value: [], enumerable: true, writable: true }
      , opts: { value: {}, writable: true, enumerable: false }
      })

  // https://gist.github.com/davidaurelio/838778
  extend(haiku, EE.prototype)

  // if (typeof src === 'object') options = src
  if (typeof src === 'string') options.src = src

  haiku.configure(options)

  return haiku
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

  //   , 'log-level': 'warn'
  //   }}

  switch (option) {
    case 'src'          : return dir('src', value)
    case 'content-dir'  : return dir('content', value)
    case 'build-dir'    : return dir('build', value)
    case 'templates-dir': return dir('templates', value)
    case 'public-dir'   : return dir('public', value)
    case 'log-level'    :
      if (value) return haiku.opts[option] = value
      else return haiku.opts[option] || 'warn'
      break;
  }

  function dir(name, v){
    var o = name === 'src' ? name : name + '-dir'
    if (o === 'src' && ! value && !haiku.opts[o]) return process.cwd()

    if (v) return haiku.opts[o] = path.resolve(haiku.opt('src'), v)
    else return haiku.opts[o] || path.resolve(haiku.opt('src'), name)
  }
}


function read(){
  var haiku = this
    , powerwalk = require('powerwalk')

  powerwalk(haiku.opt('content-dir'))
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

  haiku.logger.debug('starting build')
  haiku.logger.info('removing --build-dir %s', haiku.opt('build-dir'))

  rimraf(haiku.opt('build-dir'), function(err){
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
  if (! haiku[page.collection]) haiku[page.collection] = []

  // don't add indexes to the list
  if (! path.basename(page.url).match(/^index/)) {
    haiku[page.collection].push(page)
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
