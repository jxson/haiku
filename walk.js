var fs = require('graceful-fs')
  , path = require('path')
  , glob = require('glob')
  , EE = require('events').EventEmitter
  , extend = require('util')._extend

module.exports = function(dir){
  return Object.create(EE.prototype, { walk: { value: walk }
  , stat: { value: stat }
  , queue: { value: [] }
  }).walk(dir)
}

function walk(dirname){
  var walker = this
    , gloptions = { cwd: dirname
      , strict: true
      }

  walker.cwd = dirname

  glob('**', gloptions, function(err, matches){
    if (err) return walker.emit('error', err)

    matches.forEach(function(match){
      if (match.length === 0) return
      else walker.stat(match)
    })
  })

  return walker
}

function stat(match){
  var walker = this
    , queue = walker.queue
    , pathname = path.join(walker.cwd, match)

  walker.queue.push(pathname)

  fs.stat(pathname, function(err, stats){
    if (err) return walker.emit('error', err)

    walker.queue.splice(walker.queue.indexOf(pathname), 1)

    if (stats.isFile()) walker.emit('file', pathname)
    if (walker.queue.length === 0) walker.emit('end')
  })
}
