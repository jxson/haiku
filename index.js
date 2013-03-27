
var extend = require('util')._extend
  , EE = require('events').EventEmitter
  , rimraf = require('rimraf')

module.exports = function(src, options){
  var haiku = Object.create({ configure: configure
      , read: read
      , build: build
      })

  // https://gist.github.com/davidaurelio/838778
  extend(haiku, EE.prototype)

  if (options) haiku.configure(options)

  return haiku
}

function configure(options){
  var haiku = this

  return haiku
}

function read(){

}

function build(){
  // remove the build dir
  // hook up page listeners
  // kick off the read
}
