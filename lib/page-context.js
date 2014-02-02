
const extend = require('xtend')

module.exports = pctx

function pctx(page) {
  var meta = page.meta
    , defaults = { url: page.url
      , 'content-type': page.mime
      , title: page.title
      , draft: page.draft
      , content: page.content
      }

  return extend(meta, defaults)
}
