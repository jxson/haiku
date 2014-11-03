
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
const assert = require('assert')
const now = require('date-now')

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

function Page(options) {
  if (!(this instanceof Page)) return new Page(options)

  assert.ok(options.filename, 'options.filename is required')
  assert.ok(options.basedir, 'options.basedir is required')

  var page = this

  Object.defineProperties(page, {
    url: { get: getURL },
    slug: { get: getSlug },
    title: { get: getTitle },
    date: { get: getDate },
    draft: { get: getDraft },
    layout: { get: getLayout },
    etag: {
      get: getEtag
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

  page.filename = options.filename
  page.basedir = options.basedir
  page.name = path.relative(page.basedir, page.filename)
  page.baseurl = options.baseurl || '/'

  if (options.mtime) {
    page.mtime = new Date(options.mtime)
  } else {
    page.mtime = now()
  }

  page.meta = options.meta || {}
  page.body = options.body || ''

  page.debug = debug('haiku:page - ' + page.name)

  page.debug('init', options)
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

  var json = xtend(page.meta, {
    url: page.url,
    name: page.name,
    slug: page.slug,
    draft: page.draft,
    title: page.title,
    'last-modified': page['last-modified'],
    etag: page.etag,
    enumerable: true,
    'content-type': page['content-type'],
    body: page.body,
    filename: page.filename,
    basedir: page.basedir,
    mtime: page.mtime,
    layout: page.layout,
    meta: page.meta
  })

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
  var mtime = new Date(page.mtime)

  return rfc822(mtime)
}

function getIndex() {
  var page = this

  if (page.slug.match(/index$/)) {
    return path.resolve(page.baseurl, page.slug.replace('index', ''))
  }
}

function getEtag() {
  var page = this
  var debug = page.debug

  debug('page.url: %s', page.url)
  debug('page.mtime: %s', page.mtime.getTime())
  debug('page.body', page.body)

  return crypto
  .createHash('md5')
  .update(page.url)
  .update(page.mtime.toString())
  // TODO: change to rendered output
  .update(page.body || '')
  .digest('hex')
}

function getLayout() {
  var page = this
  var layout = page.meta.layout || 'default'

  if (layout === false) return false

  // No default layouts for oveeriden content-types
  if (! page.wants('html') && layout === 'default') return false

  return layout
}
