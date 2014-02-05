
// Lazy template loading and rendering, probably will be the next iteration of
// beardo

const path = require('path')
    , prr = require('prr')
    , hogan = require('hogan.js')
    , through2 = require('through2')
    , fs = require('graceful-fs')

module.exports = function(dirname){
  return new Templates(dirname)
}

function Templates(dirname){
  var templates = this

  templates.basedir = path.resolve(dirname)

  prr(templates, 'collection', {})
  prr(templates, 'queue', []) // scaned partial queue
}

Templates.prototype.set = function(key, content){
  var templates = this

  return templates.collection[key] = hogan.compile(content)
}

// Get the normalized name for key/src
Templates.prototype.name = function(src){
  var templates = this

  return src
  .replace(templates.basedir)
  .replace(/^\//, '')
  .replace('.mustache', '')
}

Templates.prototype.src = function(name){
  var templates = this
    , filename = path.join(templates.basedir, name)

  if (path.extname(filename) === '') filename += '.mustache'

  return filename
}

Templates.prototype.render = function(key, context, callback){
  var templates = this
    , layout

  if (typeof context === 'function') {
    callback = context
    context = {}
  }

  // context.layout could be false
  // if (context.layout === undefined) context.layout = 'default'
  // if (context.layout) layout = path.join('layouts', context.layout)

  templates
  .get(key, function(err, template){
    if (err) return callback(err)

    var output = template.render(context, templates.collection)

    callback(null, output)
  })
}

Templates.prototype.get = function(key, callback){
  var templates = this
    , name = templates.name(key)

  templates
  .read(key, function(err, res){
    if (err) return callback(err)

    callback(null, templates.collection[name] || templates.collection[key])
  })
}

Templates.prototype.read = function(start, callback){
  var templates = this
    , queue = Array.isArray(start) ? start : [ start ]

  queue.forEach(function(name){
    var current = queue.shift()
      , template = templates.collection[current]

    if (template) {
      queue = queue.concat(partials(template.text))
      finish(callback)
      return
    }

    var src = templates.src(name)

    fs.readFile(src, 'utf8', function(err, data){
      // This should be nicer yeah?
      if (err && err.code === 'ENOENT') err.name = 'Template Not Found'
      if (err) return callback(err)

      templates.set(name, data)

      queue = queue.concat(partials(data))

      finish(callback)
    })
  })

  function finish(callback){
    if (queue.length === 0) callback(null, templates.collection)
    else templates.read(queue, callback)
  }

}

///////// helpers

function partials(text){
  return hogan
  .scan(text)
  .filter(filter)
  .map(map)

  // filter just the partials
  function filter(node){ return node.tag === '>' }

  // return a list of just thier names, no null values
  function map(tag){ return tag.n }
}
