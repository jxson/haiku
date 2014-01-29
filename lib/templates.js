
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
  if (context.layout === undefined) context.layout = 'default'
  if (context.layout) layout = path.join('layouts', context.layout)

  templates
  .get(key, layout, function(err, template){
    if (err) return callback(err)

    var output = template.render(context, template.collection)

    callback(null, output)
  })
}

Templates.prototype.get = function(key, layout, callback){
  if (typeof layout === 'function') {
    callback = layout
    layout = undefined
  }

  var templates = this
    , name = templates.name(key)

  templates
  .read(key, layout)
  .on('error', callback)
  .on('data', function(thing){
    console.log('added', thing.toString())
  })
  .on('end', function(){
    console.log('ended')
    callback(null, templates.collection[key])
  })
}

Templates.prototype.read = function(){
  var templates = this
    , stream = through2(write)

  for (var i = 0; i < arguments.length; i ++) stream.write(arguments[i])

  stream.end()

  return stream

  function write(chunk, enc, callback){
    var name = chunk.toString()
      , template = templates.collection[name]

    console.log('stream.write', name)

    if (template) {
      stream.push(chunk)
      callback()
      return
    }

    var src = templates.src(name)

    fs.readFile(src, 'utf8', function(err, data){
      if (err) return callback(err)

      template = templates.set(name, data)

      stream.push(chunk)
      callback()
    })

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
