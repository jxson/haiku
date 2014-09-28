
const fs = require('graceful-fs')
const path = require('path')
const error = require('./formatted-error')
const prr = require('prr')
const url = require('url')
const mime = require('mime')
const hogan = require('hogan.js')
const xtend = require('xtend')
const debug = require('debug')
const slug = require('to-slug-case')
const humanize = require('string-humanize')
const crypto = require('crypto')
const rfc822 = require('rfc822-date')

module.exports = Page

/*

Attributes:

* name: relative name for finding later (default title)
* basedir: the source dir to esolve against for urls, names, etc
* filename: the original file path
* url: the url of the page
* title:
* date
* draft:
* meta: the extracted front-matter
* last-modified: last-modified obvs.
* etag: unique id for the entity for proper http caching
* content-type: the content-type of the page, can be defined in the meta

* outfile: the destination of the rendered page (determined by haiku)

* context:
* render: template function

*/

function Page(filename, basedir, baseurl) {
  if (!(this instanceof Page)) return new Page(filename, basedir, baseurl)

  var page = this

  Object.defineProperties(page, {
    url: { get: getURL },
    slug: { get: getSlug },
    title: { get: getTitle },
    date: { get: getDate },
    draft: { get: getDraft },
    stats: {
      get: getStats,
      set: setStats
    },
    'content-type': {
      get: getContentType
    },
    'last-modified': {
      get: getLastModified
    },
    index: {
      get: getIndex
    }
  }, { enumerable: true })

  page.stats = new fs.Stats()
  page.filename = filename
  page.basedir = basedir
  page.name = path.relative(basedir, filename)
  page.meta = {}
  page.baseurl = baseurl || '/'

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
  var match = page['content-type'].match(string)

  return match
}

Page.prototype.toJSON = function() {
  var page = this

  var json = {
    url: page.url,
    name: page.name,
    slug: 'slug',
    draft: page.draft
  }

  return json
}

function getSlug() {
  var page = this
  var extension = path.extname(page.url)
  var basename = path.basename(page.url)
  var cleaned = basename.replace(extension, '')
  var dirname = path.dirname(page.name)
  var _slug = slug(cleaned)

  return path.join(dirname, _slug)
}

function getURL() {
  var page = this
  var _url = url.resolve('/', page.name)
  var extension = path.extname(page.name)
  var translated = extension
  var debug = page.debug

  if (page.wants('html')) {
    _url = _url.replace(extension, '.html')
  }

  if (page.baseurl !== '/') {
    _url = path.join(page.baseurl, _url)
  }

  return _url
}

function getTitle() {
  var page = this
  var title = path.basename(page.slug)

  return page.meta.title || humanize(title)
}

function getDate() {
  var page = this

  return page.meta.date
}

function getDraft() {
  var page = this

  return !! page.meta.draft || false
}

function setStats(stats) {
  var page = this
  var isStats = (stats instanceof fs.Stats) || ! stats

  if (! isStats) return

  page._stats = stats

  if (! stats.ino || ! stats.mtime || ! stats.size) return

  page.etag = crypto
  .createHash('md5')
  .update(stats.ino.toString())
  .update(stats.mtime.toString())
  .update(stats.size.toString())
  .digest('hex')
}

function getStats(stats) {
  var page = this

  // TODO: make private
  return page._stats
}

function getContentType() {
  var page = this
  var override = page.meta['content-type']


  if (page.is('markdown')) {
    ct = mime.lookup('.html')
  } else {
    ct = mime.lookup(page.name)
  }

  if (override) ct = override

  return ct
}

function getLastModified() {
  var page = this

  return rfc822(page.stats.mtime)
}

function getIndex() {
  var page = this

  if (page.slug.match(/index$/)) {
    return path.resolve(page.baseurl, page.slug.replace('index', ''))
  }
}
