
const fs = require('graceful-fs')
const path = require('path')

module.exports = read
module.exports.ctor = Page

function read(filename, basedir, callback) {
  Page(filename, basedir)
  .read(callback)
}

function Page(filename, basedir) {
  if (!(this instanceof Page)) return new Page(filename, basedir)

  var page = this

  page.stats = new fs.Stats()
  page.infile = filename
  page.basedir = basedir
  page.name = path.relative(basedir, filename)

  // Faking it for now
  page.url = '/' + page.name.replace('.md', '.html'),
  page.slug = 'slug'
  //   index: 'foo/' // when url === foo/index.html
}

// TODO: chache this stuff
Page.prototype.read = function(callback) {
  var page = this
  var filename = page.infile

  fs.stat(filename, onstat)

  function onstat(err, stats) {
    if (err) return callback(err)

    page.stats = stats

    fs.readFile(filename, 'utf8', onread)
  }

  function onread(err, data) {
    if (err) return callback(err)
    else callback(null, page)
  }
}
