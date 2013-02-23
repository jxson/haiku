
module.exports = handler

function handler(req, res, opts){
  var haiku = this
    , opts = opts || {}

  haiku.configure(opts)

  return h

  function h(url, context, code){
    var context = context || {}
      , code = code || 200

    // If the content is in the haiku render it
    // otherwise res with a 404
    if (! haiku.has(url)) return error(res)
    else haiku.read(function(err, page){
      if (err) throw err

      var page = haiku.pages[url]

      if (! page) return error(res)

      // set headers from page object (etag, content-length,
      // content-type)
      page.render(context, function(err, output){
        if (err) throw err

        res.statusCode = 200
        res.end(output)
      })
    })
  }

  function error(res){
    res.setHeader('content-type', 'text/plain')
    res.statusCode = 404
    res.write('a blank page stares back\n')
    res.write('this entity is missing\n')
    res.write('but there are others\n')
    res.end()
  }
}
