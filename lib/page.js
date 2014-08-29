
const fs = require('graceful-fs')
const path = require('path')
const error = require('./formatted-error')
const prr = require('prr')

module.exports = Page

/*

Attributes:

* basedir: the source dir to esolve against for urls, names, etc
* infile: the original file path
* outfile: the destination of the rendered page (determined by haiku)
* meta: the extracted front-matter
* content: unrendered file contents with the front-matter removed
* content-type: the content-type of the page, can be defined in the meta
* url: the url of the page
* etag: unique id for the entity for proper http caching
* last-modified: last-modified obvs.
* name: relative name for finding later (default title)
* title:
* draft:
* render: template function
* is: fn - is the file of a content-type?
* wants: fn - is the outfile of a content-type?

* context: {
  content-type:
  title:
  draft:
}

*/

function Page(filename, basedir) {
  if (!(this instanceof Page)) return new Page(filename, basedir)

  var page = this

  page.stats = new fs.Stats()
  page.infile = filename
  page.basedir = basedir
  page.name = path.relative(basedir, filename)

  Object.defineProperties(page, {
    url: { get: url }
  }, { enumerable: true })

  page.slug = 'slug'
  page.index = 'foo/' // when url === foo/index.html
}

Page.prototype.set = function(key, value) {
  var page = this

  switch (key) {
    case 'stats':
      break;
    case 'data':
      break;
    default:
      throw error('%s is not a settable attribute', key)
  }

  return page
}

Page.prototype.toJSON = function() {
  var page = this

  var json = {
    url: page.url,
    name: page.name,
    slug: 'slug'
  }

  return json
}

function url() {
  var page = this
  var url = '/' + page.name.replace('.md', '.html')

  // TODO: fix this nieve implementation
  return url
}
