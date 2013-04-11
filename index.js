
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
      , opt: opt
      }, { logger: { value: false, writable: true }
      , pages: { value: [], enumerable: true, writable: true }
      , options: { value: {}, writable: true }
      })

  // https://gist.github.com/davidaurelio/838778
  extend(haiku, EE.prototype)

  // if (typeof src === 'object') options = src
  // if (typeof src === 'string') options.src = src || process.cwd()

  if (options) haiku.configure(options)

  return haiku
}

function configure(options){
  var haiku = this

  Object.keys(options).forEach(function(key){
    haiku.opt(key, options[key])
  })

  // // TODO: move this out to the CLI in case people use the API direclty
  // // and don't want the logs
  // if (! haiku.logger) {
  //   haiku.logger = bunyan.createLogger({name: 'haiku'
  //   , level: haiku.options['log-level']
  //   })
  // }
  //
  // if (haiku.logger.level() !== haiku.options['log-level']) {
  //   haiku.logger.level(haiku.options['log-level'])
  // }

  return haiku
}

// A dumb getter/ setter function for haiku.options. Using normal ES5
// getters and setters seemed weird since directory paths etc were
// getting normalized/ mutated in unexpected ways
function opt(option, value){
  var haiku = this

  // , defaults: {
  //   , 'content-dir': 'content'
  //   , 'content-dir': 'content'
  //   , 'build-dir': 'build'
  //   , 'templates-dir': 'templates'
  //   , 'public-dir': 'public'
  //   , 'log-level': 'warn'
  //   }}

  switch (option) {
    case 'src':
      if (! value) return haiku.options[option] || process.cwd()
      else return haiku.options.src = path.resolve(value)
      break
    case 'content-dir':
      if (! value) {
        return haiku.options[option] || path.resolve(haiku.opt('src'), 'content')
      } else return haiku.options['content-dir'] = path.resolve(haiku.opt('src'), value)
      break
    case 'build-dir':
      if (! value){
        return haiku.options[option] || path.resolve(haiku.opt('src'), 'build')
      } else {
        return haiku.options['build-dir'] = path.resolve(haiku.opt('src'), value)
      }
      break;
    case 'templates-dir':
      if (! value){
        return haiku.options[option] || path.resolve(haiku.opt('src'), 'templates')
      } else {
        return haiku.options['templates-dir'] = path.resolve(haiku.opt('src'), value)
      }
      break;
    case 'public-dir':
      if (! value){
        return haiku.options[option] || path.resolve(haiku.opt('src'), 'public')
      } else {
        return haiku.options['public-dir'] = path.resolve(haiku.opt('src'), value)
      }
    default:
      throw new Error(option + ' is not a valid haiku option')
  }
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
