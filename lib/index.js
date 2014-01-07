
const assert = require('assert')
    , prr = require('prr')
    , path = require('path')
    , allowedopts = [ 'src'
      , 'content-dir'
      , 'build-dir'
      , 'templates-dir'
      , 'public-dir'
      ]

module.exports = function(options){
  return new Haiku(options)
}

module.exports.ctor = Haiku

function Haiku(options){
  var haiku = this

  // defaults
  prr(haiku, 'options', { src: process.cwd() })

  // needs `haiku.options.src` defined ahead of calling `haiku.resolve()`
  allowedopts.forEach(function(opt){
    if (opt === 'src') return
    var dirname = opt.replace('-dir', '')
    haiku.options[opt] = haiku.resolve(dirname)
  })
}

Haiku.prototype.opt = function(option, value){
  var haiku = this
    , getting = value === undefined
    , dirname = ! getting ? value.replace('-dir', '') : undefined
    , isAllowed = allowedopts.indexOf(option) >= 0

  assert.ok(isAllowed, '"' + option + '" is not a valid haiku option.')

  // If getting return the value for the requested option. Otherwise set it and
  // return the haiku instance.
  if (getting) return haiku.options[option]
  else haiku.options[option] = haiku.resolve(dirname)

  return haiku
}

// Resolves a `dirname` against the haiku instances `src` option.
Haiku.prototype.resolve = function(dirname){
  var haiku = this
    , src = haiku.opt('src')

  return path.resolve(src, dirname)
}
