// Lazy template loading and rendering, probably will be the next iteration of
// beardo

const path = require('path')
const hogan = require('hogan.js')
const debug = require('debug')('haiku:template')
const fs = require('graceful-fs')

module.exports = Template

function Template(options) {
  if (!(this instanceof Template)) return new Template(options)

  if (typeof options === 'string') {
    options = { basedir: options }
  }

  var template = this

  template.basedir = path.resolve(options.basedir)
  template.collection = {}
}

Template.prototype.has = function(key) {
  return !! this.collection[key]
}

Template.prototype.resolve = function(key) {
  var template = this
  var filename = path.join(template.basedir, key)

  if (path.extname(filename) === '') filename += '.mustache'

  return filename
}


Template.prototype.get = function(key, callback) {
  var template = this

  debug('get: %s', key)

  if (template.has(key)) {
    debug('has  %s', key)
    var t = this.collection[key]

    if (t.partials.length) {
      debug('crap, it has partials')
    } else {
      callback(null, t.template)
    }
  } else {
    debug('need to read from fs %s', key)

    fs.readFile(template.resolve(key), 'utf8', function(err, data){
      if (err) return callback(err)
      // // This should be nicer yeah?
      // if (err && err.code === 'ENOENT') err.name = 'Template Not Found'
      // if (err) return callback(err)

      template.set(key, data)

      // call get again in case of partials
      template.get(key, callback)
    })

  }


  // Templates.prototype.read = function(start, callback){
  //   var templates = this
  //     , queue = Array.isArray(start) ? start : [ start ]
  //
  //   queue.forEach(function(name){
  //     var current = queue.shift()
  //       , template = templates.collection[current]
  //
  //     if (template) {
  //       queue = queue.concat(partials(template.text))
  //       finish(callback)
  //       return
  //     }
  //
  //     var src = templates.src(name)
  //
  //     fs.readFile(src, 'utf8', function(err, data){
  //       // This should be nicer yeah?
  //       if (err && err.code === 'ENOENT') err.name = 'Template Not Found'
  //       if (err) return callback(err)
  //
  //       templates.set(name, data)
  //
  //       queue = queue.concat(partials(data))
  //
  //       finish(callback)
  //     })
  //   })
  //
  //   function finish(callback){
  //     if (queue.length === 0) callback(null, templates.collection)
  //     else templates.read(queue, callback)
  //   }
  //
  // }

}

Template.prototype.set = function(key, content) {
  this.collection[key] = {
    template: hogan.compile(content),
    partials: hogan.scan(content)
      .filter(isPartial)
      .map(name)
  }

  // allows chaining like: t.set(k, v).render(ctx, cb)
  return {
    render: this.render.bind(this, key)
  }
}

function isPartial(node) {
  return node.tag === '>'
}

function name(tag) {
  return tag.n
}

Template.prototype.render = function(key, context, callback) {
  var template = this

  if (typeof context === 'function') {
    callback = context
    context = {}
  }

  debug('render %s', key)

  // context.layout could be false
  // if (context.layout === undefined) context.layout = 'default'
  // if (context.layout) layout = path.join('layouts', context.layout)

  template.get(key, function(err, t, partials) {
    if (err) return callback(err)

    var output = t.render(context, partials)

    callback(err, output)
  })
}

// // Get the normalized name for key/src
// Templates.prototype.name = function(src){
//   var templates = this
//
//   return src
//   .replace(templates.basedir)
//   .replace(/^\//, '')
//   .replace('.mustache', '')
// }
//
