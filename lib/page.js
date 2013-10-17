
const path = require('path')
    , fs = require('graceful-fs')
    , fm = require('front-matter')
    , assert = require('assert')
    , mime = require('mime')

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

Page.prototype.mime = function(){
  assert.ok(this.isRead(), 'reequires page.read()')

  var page = this
    , isMarkdown = mime.lookup(page.src) === 'text/x-markdown'
    , override = page.meta['content-type']
    , converted = override || mime.lookup('.html')

  return isMarkdown ? converted : mime.lookup(page.src)
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

/*

# Render lifecycle

NOTE: look up jekyll content

* body - the raw data for the file
* compile mustache and look for/ add partials
* render mustache before transforms
* transform: MD, textile? // can mustache do this first?
* content - fully rendered output
  * don't apply layouts to non-html

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
