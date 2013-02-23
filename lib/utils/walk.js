
var fs = require('graceful-fs')
  , path = require('path')
  , EE = require('events').EventEmitter
  , glob = require('glob')

module.exports = function(dir){
  return Object.create(EE.prototype, { walk: { value: walk }
  , read: { value: read }
  , finish: { value: finish }
  , queue: { value: [] }

  }).walk(dir)
}

function walk(dir){
  var walker = this
    , gloptions

  walker.dir = dir

  gloptions = { cwd: path.normalize(dir)
  , strict: true
  }

  glob('**', gloptions, function(err, matches){
    if (err) return emitter.emit('error', err)

    matches.forEach(function(match){
      // dont count the current dir
      if (match.length === 0) return

      var pathname = path.join(walker.dir, match)

      walker.read(pathname)
    })
  })

  return walker
}

function finish(entity, obj){
  var walker = this
    , queue = walker.queue

  // only emit if there are listeners.
  // emit dir, file, or entry
  walker.emit(entity, obj)

  queue.splice(queue.indexOf(obj.pathname), 1)

  if (queue.length === 0) walker.emit('end')
}

function read(pathname){
  var walker = this

  // keep track of this for later
  walker.queue.push(pathname)

  fs.stat(pathname, function(err, stats){
    if (err) return emitter.emit('error', err)

    if (stats.isDirectory()) {
      walker.finish('dir', { stats: stats, path: pathname })
    } else {
      fs.readFile(pathname, 'utf8', function(err, data){
        if (err) return emitter.emit('error', err)

        walker.finish('file', { stats: stats, path: pathname, data: data })
      })
    }
  })
}
