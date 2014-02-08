
const path = require('path')
    , pctx = require('./page-context')

module.exports = hctx

function hctx(pages) {
  var context = {}

  // should optimize this
  for (var url in pages) {
    var page = pages[url]
      , parent = context
      , diff = path.relative(page.basedir, path.dirname(page.src))
      , startdir = path.join('content', diff)
      , keys = startdir.split(path.sep)
      , pageContext = pctx(page, pages)

    // NOTE: pageContext/pctx gets defined/called twice, once here and once
    // higher up right before rendering. It might be better to make it easy to
    // get a selector to this attiribute instead of creating mutliple
    // objects...

    // defines collections and sets the pages
    keys.forEach(function(key){
      var isLast = key === keys[keys.length - 1]
        , isNotAnIndex = ! path.basename(page.url).match(/^index/)
        , isNotADraft = !page.draft
        , isEnumerable = page.meta.enumerable !== false

      // This defines a property on the collection that is the next collection.
      // Hacky, but it allows chains in mustache {{#foo.bar.baz}} which is nice
      if (! parent[key]) parent[key] = []

      if (isLast && isNotAnIndex && isNotADraft && isEnumerable) {
        parent[key].push(pageContext)
      }

      if (isLast) {
        // the sort thing
        parent[key].sort(function(a, b){
          var aHasDate = !! a.date
            , bHasDate = !! b.date
            , sortByDate = aHasDate && bHasDate

          if (sortByDate) return a.date < b.date ? 1 : -1
          else return a.url > b.url ? 1 : -1
        })
      }

      // bubble the parent to the next key
      parent = parent[key]

    })

  }

  return context
}
