
const extend = require('xtend')

module.exports = pctx

function pctx(page) {
  var meta = page.meta
    , defaults = { url: page.url
      , 'content-type': page.mime
      , title: page.title
      , draft: page.draft
      }
    , overrides = {}

  overrides.url = defaults.url

  return extend(defaults, meta, overrides)
}
