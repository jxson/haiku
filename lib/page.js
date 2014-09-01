
const fs = require('graceful-fs')
const path = require('path')
const error = require('./formatted-error')
const prr = require('prr')
const url = require('url')
const mime = require('mime')
const fm = require('front-matter')
const hogan = require('hogan.js')
const xtend = require('xtend')
const debug = require('debug')

module.exports = Page

/*

Attributes:

* basedir: the source dir to esolve against for urls, names, etc
* filename: the original file path
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
  page.filename = filename
  page.basedir = basedir
  page.name = path.relative(basedir, filename)
  page.meta = {
    title: page.name
  }

  Object.defineProperties(page, {
    url: { get: getURL }
  }, { enumerable: true })

  page.slug = 'slug'
  page.index = 'foo/' // when url === foo/index.html

  page.debug = debug('haiku:page - ' + page.name)
}

Page.prototype.is = function(string) {
  var page = this
  var _mime = mime.lookup(page.name)
  var match = !!_mime.match(string)

  return match
}

Page.prototype.wants = function(string) {
  var page = this
  var override = page.meta['content-type']
  var match = page.is(string)

  if (page.is('markdown')) {
    match = !! mime.lookup('.html').match(string)
  }

  if (override) {
    match = !! override.match(string)
  }

  return match
}

Page.prototype.set = function(key, value) {
  var page = this

  switch (key) {
    case 'stats':
      break;
    case 'data':
      page.data(value)
      break;
    default:
      throw error('%s is not a settable attribute', key)
  }

  return page
}

Page.prototype.data = function(data) {
  var page = this
  var extraction

  try {
    extraction = fm(data)
  } catch (e) {
    var message = '...'
    throw new Error(message)
  }

  page.meta = xtend(page.meta, extraction.attributes)
  page.template = hogan.compile(data)
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

function getURL() {
  var page = this
  var _url = url.resolve('/', page.name)
  var extension = path.extname(page.name)
  var translated = extension

  if (page.wants('html')) translated = '.html'

  return _url.replace(extension, translated)
}
