
module.exports = function(filename, haiku){
  return new Page(filename, haiku)
}

function Page(filename, haiku){
  var page = this
    , assert = require('assert')

  assert.ok(haiku, 'Page requires a haiku instance')

  page.haiku = haiku
  page.filename = filename
  page.name = name(filename, haiku)
  page.dirname = dirname(filename, haiku)
}

// TODO: get this to cache based on stats when using the options.watch
Page.prototype.read = function(callback){
  var page = this
    , haiku = page.haiku
    , fs = require('graceful-fs')
    , fm = require('front-matter')
    , path = require('path')

  fs.readFile(page.filename, 'utf8', function(err, data){
    if (err) return callback(err)

    try {
      var extract = fm(data)
    } catch(e) {
      console.log('e', e)

      var error = new Error('Bad front-matter - '
      + e.problem
      + ' - '
      + page.filename
      + ':'
      + (e.problem_mark ? e.problem_mark.line : ''))

      return haiku.emit('error', error)
    }

    if (page.name === 'episodes/SR002.md') {
      console.log('episodes/SR002.md')
      console.log('extract', extract)
    }

    // page.data = data // This is only needed for debugging
    page.meta = extract.attributes
    page.body = extract.body

    // sometimes the url depends on some meta...
    page.url = url(page)
    page.destination = path.join(haiku.opt('build-dir'), page.url)

    // must be last
    page.context = context(page)

    callback()
  })
}

Page.prototype.render = function(callback){
  var page = this
    , haiku = this.haiku
    , context = {} // single use context holds page and haiku

  // merge haiku's context onto it
  for (var key in haiku.context) context[key] = haiku.context[key]

  context.page = page.context

  // This might be pulled into beardo, also an expensive operation
  // think about caching it
  // TODO: this has to happen after everything has been read, add a gaurd
  var hogan = require('hogan.js')
    , compiled = hogan.compile(page.body) // compile the body-stache
    // TODO: assign this so it can be used in other pages/ templates
    , body = compiled.render(context)
    , mime = require('mime')
    , marked = require('marked')
    , wantsMD = mime.lookup(page.filename) === 'text/x-markdown'
      && context.page['content-type'] !== 'text/x-markdown'
    , MD = wantsMD ? marked(body) : body
    , beardo = require('beardo')
    , template = beardo.add(page.filename, MD)
    , path = require('path')

  // tell beardo wheres what
  beardo.directory = path.join(haiku.opt('src'), 'templates')

  // TODO: only apply default layout to html
  context.layout = context.page.layout

  // ???: beardo needs a way to distinguish templates that need reading
  // vs ones that were added manually
  beardo.render(page.filename, context, callback)
}

// utility functions

// Extract the name from a file
function name(filename, haiku){
  var path = require('path')

  return filename
  // remove the content-dir
  .replace(haiku.opt('content-dir'), '')
  // trim leading slash
  .replace(new RegExp('^' + path.sep), '')
}


function dirname(filename, haiku){
  var path = require('path')

  return path
  .relative(haiku.opt('src'), path.dirname(filename))
}

function url(page){
  var path = require('path')
    , haiku = page.haiku
    , uri = page.filename.replace(haiku.opt('content-dir'), '')

  var mime = require('mime')
    , ct = mime.lookup(page.filename)
    , ext = path.extname(page.filename)
    , wants = page.meta['content-type']

  if (ct === 'text/x-markdown') {
    if (ct === wants) return uri
    else return uri.replace(ext, '.html')
  }

  return uri
}

function context(page){
  var ctx = { title: page.name
      , name: page.name
      }
    , haiku = page.haiku

  // apply user overrides
  for (var key in page.meta) {
    var value = page.meta[key]
      , isString = typeof value === 'string'
      , matches = isString ? value.match('haiku:content/') : null

    // if it's a haiku helper, create a function
    if (matches) {
      ctx[key] = function(){
        // removes the "haiku:content/"
        var name = value.replace(matches[0], '')
          , n = name.replace(/\/$/, '/index.html')
          , filtered = haiku.pages.filter(function(page){
               return page.name === n || page.url === n
            })
          , expanded = filtered[0]

        // NOTE: this should throw in a menaingful way if your trying to
        // expand a page that doesn't exitst
        if (! expanded) {
          console.error('haiku.pages', haiku.pages)
          throw new Error( name + ' does not exist')
        }

        return expanded.context
      }
    } else ctx[key] = value
  }

  // apply non-overrideable keys
  ctx.url = page.url

  // helpers/ lambdas
  ctx.next = function(){
    var parent = page.haiku.context
      , path = require('path')
      , keys = page.dirname.split(path.sep)

    keys.forEach(function(key){
      parent = parent[key]
    })

    return parent[parent.indexOf(page.context) + 1]
  }

  ctx.previous = function(){
    var parent = page.haiku.context
      , path = require('path')
      , keys = page.dirname.split(path.sep)

    keys.forEach(function(key){
      parent = parent[key]
    })

    return parent[parent.indexOf(page.context) - 1]
  }

  return ctx
}
