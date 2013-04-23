
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
  Object.defineProperty(page, 'dirname', { get: dirname })
  Object.defineProperty(page, 'url', { get: url })
  Object.defineProperty(page, 'context', { get: context })

  Object.defineProperty(page, 'build', { value: build })
  Object.defineProperty(page, 'render', { value: render })
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
  .replace(haiku.opt('content-dir'), '')
  .replace(new RegExp('^' + path.sep), '') // trims leading slash
}

function destination(){
  var page = this
    , haiku = page.haiku

  return path.join(haiku.opt('build-dir'), page.url)
}

function dirname(){
  var page = this
    , haiku = page.haiku

  return path
  .relative(haiku.opt('src'), path.dirname(page.filename))
}

function collection(){
  var page = this
    , haiku = page.haiku

  return path
  .relative(haiku.opt('src'), path.dirname(page.filename))
  .replace(path.sep, '.')
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

function render(ctx, callback){
  var page = this
    , haiku = page.haiku

  if (typeof ctx === 'function') {
    callback = ctx
    ctx = {}
  }

  // adds haiku.ctx to the ctx argument
  for (var key in haiku.context) ctx[key] = haiku.context[key]

  ctx.page = page.context


  // This might be pulled into beardo, also an expensive operation
  // think about caching it
  // NOTE: this has to happen after everything has been read
  var compiled = hogan.compile(page.body)
    , mustached = compiled.render(ctx)
    , MD = marked(mustached)
    , template = beardo.add(page.filename, MD)

  // tell beardo wheres what
  beardo.directory = path.join(haiku.opt('src'), 'templates')

  // ???: beardo needs a way to distinguish templates that need reading vs
  // ones that were added manually
  beardo.render(page.filename, ctx, function(err, out){
    page.logger.info('rendered page')
    page.logger.info(out)

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

function context(){
  var page = this
    , haiku = page.haiku
    , defaults = { title: page.name }

  page._context = page._context || {}

  // Build the context with the defaults
  for (var key in defaults) page._context[key] = defaults[key]

  // apply overrides
  for (var key in page.meta) {
    var value = page.meta[key]
      , isString = typeof value === 'string'
      , matches = isString ? value.match('haiku:content/') : null

    // Deal with keys that expand other pages
    if (matches) {
      // removes the "haiku:content/"
      var name = value.replace(matches[0], '')
        , expanded = haiku.find(name)

      // NOTE: this should throw in a menaingful way if your trying to
      // expand a page that doesn't exitst
      if (! expanded) {
        console.error('haiku.pages', haiku.pages)
        throw new Error( name + ' does not exist')
      }

      page._context[key] = expanded.context
    } else page._context[key] = value
  }

  // Apply the tings we don't want overidden
  page._context.body = page.body
  page._context.url = page.url
  page._context.name = page.name

  // Helpers / lambdas
  page._context.next = function(){
    var keys = page.collection.split('.')
      , parent = page.haiku.context

    keys.forEach(function(key){
      parent = parent[key]
    })

    return parent[parent.indexOf(page._context) + 1]
  }

  page._context.previous = function(){
    var keys = page.collection.split('.')
      , parent = page.haiku.context

    keys.forEach(function(key){
      parent = parent[key]
    })

    return parent[parent.indexOf(page._context) - 1]
  }

  return page._context
}
