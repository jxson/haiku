
const ini = require('ini')
    , fs = require('graceful-fs')
    , path = require('path')
    , haiku = require('./')

module.exports = function(params, options, callback){
  console.log('params', params)
  console.log('options', options)

  var src = haiku(options).opt('src')

  console.log('src', src)

  var file = path.join(src, '.haikuconfig')

  // [ 'set', 'get', 'delete', 'rm', 'edit', 'list', 'ls' ]

  switch (params.action){
    case 'set': return set(params.key, params.value, callback)
    case 'get': return get(params.key, callback)
    case 'delete': return del(params.key, callback)
    case 'list': return list(callback)
    case 'edit': return edit(callback)
    default: return callback(new Error('No config action ' + params.action))
  }
}
