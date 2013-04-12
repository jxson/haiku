
var path = require('path')
  , fm = require('front-matter')
  , marked = require('marked')
  , hogan = require('hogan.js')
  , beardo = require('beardo')
  , mkdirp = require('mkdirp')
  , fs = require('graceful-fs')
  , extensions = { '.md': '.html'
    , '.markdown': '.html'
    , '.mdown': ".html"
    , '.mustache': '.html'
    , '.mkdn': '.html'
    , '.mkd': '.html'
    }

module.exports = function(file, haiku){
  var page = typeof file === 'string' ? { filename: file } : file

  // extends the passed in object and returns it
  Object.defineProperty(page, 'haiku', { value: haiku })
  Object.defineProperty(page, 'name', { get: name })
  Object.defineProperty(page, 'destination', { get: destination })
  Object.defineProperty(page, 'collection', { get: collection })
  Object.defineProperty(page, 'url', { get: url })

  Object.defineProperty(page, 'build', { value: build })
  Object.defineProperty(page, 'render', { value: render })

  Object.defineProperty(page, 'body', { get: body })
  Object.defineProperty(page, 'meta', { get: meta })

  Object.defineProperty(page, 'logger', {
    value: haiku.logger.child({ page: page.name })
  })

  //   , stats: { value: {}, writable: true }
  //   , data: { value: '', writable: true }
  //   }
  // , page = Object.create({ read: read
  //   , write: write
  //   , render: render
  //   }, props)

  return page
}

function name(){
  var page = this
    , haiku = page.haiku

  return page.filename
  .replace(haiku.opt('src'), '')
  .replace(/^\//, '') // trims leading slash, should use path.sep
}

function destination(){
  var page = this
    , haiku = page.haiku

  return path.join(haiku.opt('build-dir'), page.url)
}

function collection(){
  var page = this
    , haiku = page.haiku

  return path.relative(haiku.opt('src'), page.filename)
}

function url(){
  var page = this
    , haiku = page.haiku
    , uri = page.filename.replace(haiku.opt('content-dir'), '')

  Object.keys(extensions).forEach(function(extension){
    // TODO: stop looping if an extension matches
    uri = uri.replace(extension, extensions[extension])
  })

  return uri
}

function build(callback){
  var page = this

  page.render(function(err, out){
    if (err) return haiku.emit(err)

    mkdirp(path.dirname(page.destination), function(err, made){
      if (err) return callback(err)

      if (made) page.logger.info('created dir: %s', page.dirname)

      fs.writeFile(page.destination, out, function(err){
        if (err) return callback(err)

        page.logger.info('built')

        callback()
      })
    })

  })
}

function render(context, callback){
  var page = this
    , haiku = page.haiku

  var context = context || {}
    // This might be pulled into beardo, also an expensive operation
    // think about caching it
    // NOTE: this has to happen after everything has been read
  var compiled = hogan.compile(page.body)
    , mustached = compiled.render(haiku)
    , MD = marked(mustached)
    , template = beardo.add(page.filename, MD)

  if (typeof context === 'function') {
    callback = context
    context = {}
  }

  // tell beardo wheres what
  beardo.directory = path.join(haiku.opt('src'), 'templates')

  // ???: beardo needs a way to distinguish templates that need reading vs
  // ones that were added manually
  beardo.render(page.filename, haiku, function(err, out){
    page.logger.info('rendered page')

    if (err) return callback(err)
    else return callback(null, out)
  })
}

// TODO: throw a meaningful error when page.data is missing
function body(){
  return fm(this.data).body
}

// TODO: throw a meaningful error when page.data is missing
function meta(){
  return fm(this.data).attributes
}