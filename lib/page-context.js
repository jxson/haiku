
const extend = require('xtend')

module.exports = pctx

function pctx(page, collection) {
  var meta = page.meta
    , defaults = { 'content-type': page.mime
      , title: page.title
      , draft: page.draft
      }
    , overrides = { url: page.url }

  // check for haiku helpers in the user suplied meta
  for (var key in meta) {
    var value = meta[key]
      , isString = typeof value === 'string'
      , matches = isString ? !!value.match('haiku:content') : false

    if (matches) meta[key] = expand(value)
  }

  return extend(defaults, meta, overrides)

  function expand(key){
    var name = key.replace('haiku:content', '')
      , page = collection[key]

    // duplicated from h.get()
    if (! page) Object.keys(collection).forEach(function(url){
      if (collection[url].name === name) page = collection[url]
    })

    return pctx(page, collection)
  }
}
