
var extend = require('util')._extend
  , EE = require('events').EventEmitter
  , rimraf = require('rimraf')

module.exports = function(src, options){
  var options = options || {}
    , haiku = Object.create({ configure: configure
      , read: read
      , build: build
      }, { options: { value: {}, writable: true } })

  // https://gist.github.com/davidaurelio/838778
  extend(haiku, EE.prototype)

  options.src = src
  haiku.configure(options)

  return haiku
}

function configure(options){
  var haiku = this

  Object.keys(options).forEach(function(key){
    haiku.options[key] = options[key]
  })

  return haiku
}

function read(){

}

function build(){
  // remove the build dir
  // hook up page listeners
  // kick off the read
}
