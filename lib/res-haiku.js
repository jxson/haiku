
module.exports = function(req, res, haiku){
  return handler

  function handler(url, code, context){
    for (var i = 0; i < arguments.length; i ++){
      switch (typeof arguments[i]) {
        case 'string': url = arguments[i]
        case 'number': code = arguments[i]
        case 'object': context = arguments[i]
      }
    }

    haiku.get(url, function(err, entity){
      // TODO: do something better here (use error-page if defined)
      if (err) throw err
      if (! entity) return notfound()

      res.statusCode = 200
      res.setHeader('content-type', entity['content-type'])
      res.setHeader('etag', entity['etag'])
      res.setHeader('last-modified', entity['content-type'])

      entity.render(context).pipe(res)
    })
  }

  function notfound(){
    res.setHeader('content-type', 'text/plain')
    res.statusCode = 404
    res.write('this is a blank page\n')
    res.write('the entity is missing\n')
    res.write('but there are others\n')
    res.end()
  }
}
