
const path = require('path')
    , fs = require('graceful-fs')
    , fm = require('front-matter')
    , assert = require('assert')
    , mime = require('mime')
    , beardo = require('beardo')

    , marked = require('marked')

    , through = require('through2')

module.exports = function(file, data){
  return new Page(file, data)
}

module.exports.ctor = Page

/*

Attributes:

* src: the original file path
* meta: the extracted front-matter
* content: unrendered file contents with the front-matter removed
* content-type: the content-type of the page, can be defined in the meta
* url: the url of the page
* out: full destination path, determined by resovling the build-dir and the url
* etag: unique id for the entity for proper http caching
* last-modified: last-modified obvs.

*/

function Page(file, haiku){
  var page = this

  page.src = file
  page.haiku = haiku
}

Page.prototype.isRead = function(callback){
  return this.meta && this.content
}



// This should be moved to a place where it can be easily cached
Page.prototype.read = function(callback){
  var page = this
    , haiku = page.haiku

  page.reset()

  fs.readFile(page.src, 'utf8', function(err, data){
    if (err) return callback(err)

    try { var extraction = fm(data) }
    catch(e) {
      var message = [ 'Bad front-matter - '
          , e.problem
          , ' - '
          , page.src
          , ':'
          , (e.problem_mark ? e.problem_mark.line : '')
          ].join()
      return callback(new Error(message))
    }

    page.meta = extraction.attributes
    page.content = extraction.body

    callback(null, page)
  })

}

// resets all properties except .src and .haiku
Page.prototype.reset = function(){
  var page = this
    , reserved = [ 'src', 'haiku' ]

  reserved.has = has

  Object.keys(this).forEach(function(key){
    if (! reserved.has(key)) key = undefined
  })

  function has(key){
    return reserved.indexOf(key) >= 0
  }
}

Page.prototype.is = function(type){
  return mime.lookup(this.src) === type
}

// this needs some love
Page.prototype.mime = function(){
  assert.ok(this.isRead(), 'reequires page.read()')

  var page = this
    , override = page.meta['content-type']
    , converted = override || mime.lookup('.html')

  return page.is('text/x-markdown') ? converted : mime.lookup(page.src)
}

Page.prototype.name = function(){
  var page = this
    , haiku = page.haiku

  return page.src.replace(haiku.opt('content-dir'), '')
}

Page.prototype.url = function(){
  var page = this

  assert.ok(page.isRead(), 'reequires page.read()')

  var haiku = page.haiku
    , extension = path.extname(page.src)
    , wantedExtension = '.' + mime.extension(page.mime())

  return page.name().replace(extension, wantedExtension)
}

Page.prototype.out = function(){

}


Page.prototype.render = function(context, callback){
  var page = this
    , haiku = page.haiku
    , layout = context.layout

  if (typeof context === 'function') {
    callback = context
    context = {}
  }

  // make sure mulitple things can be applied
  haiku.transform(function(page){
    if (! page.is('text/x-markdown')) return through()

    return through(function(chunk, enc, cb){
      var string = chunk.toString()
        , md = marked(string)
        , buff = new Buffer(md)

      this.push(buff)
      cb()
    })
  })

  context.layout = false

  // * compile mustache and look for/ add partials
  beardo(haiku.opt('templates-dir'))
  .add(page.name(), page.content)
  .render(page.name(), context, function(err, rendered){
    if (err) return callback(err)

    var stream = through(write)
      , parent = stream
      , out = ''

    stream.on('error', callback)

    haiku._transforms.forEach(function(fn){
      parent = parent.pipe(fn(page))
      parent.on('error', callback)
    })

    // concat for now
    parent.on('data', function(data){
      out += data
    })

    parent.on('finish', function(){

      if (page.mime() === 'text/html') context.layout = 'default'

      // do it again with the layout
      beardo(haiku.opt('templates-dir'))
      .add(page.url(), out.trim())
      .render(page.url(), context, callback)
    })

    // faking an input stream
    stream.write(rendered)
    stream.end()

    function write(chunk, enc, cb){
      this.push(chunk)
      cb()
    }
  })
}

/*

There should be two passes, one for getting the meta and one for streaming the file contents (minus the yaml) through the transforms

  h.transform(function(entity){
    return concatStream(function(data) {
      return marked(data)
    })
  })

later:

  h.get(url, function(entity) {
    entity.render(context).pipe(process.stdout)
  })

OR:

  h.get(url, function(entity) {
    entity.render(context, function(err, out){
      console.log(out)
    })
  })

OR

  haiku()
  .read()
  .pipe(build)
  .pipe(upload)

*/
