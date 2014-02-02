
const path = require('path')
    , pctx = require('./page-context')

module.exports = hctx

function hctx(pages) {
  var context = {}

  for (var url in pages) {
    var page = pages[url]
      , parent = context
      , dirname = path.relative(page.basedir, path.dirname(page.src)) || 'content'
      , keys = dirname.split(path.sep)

    // NOTE: this gets defined twice, once here and once higher up right before
    // rendering. It might be better to make it easy to get a selector to this
    // attiribute instead of creating mutliple objects...
    page.context = pctx(page)

    // defines collections and sets the pages
    keys.forEach(function(key){
      var isLast = key === keys[keys.length - 1]

      // This defines a property on the collection that is the next collection.
      // Hacky, but it allows chains in mustache {{#foo.bar.baz}} which is nice
      if (! parent[key]) parent[key] = []

      if (isLast) {
        parent[key].push(page.context)
      }
    })

  }

  return context
}
