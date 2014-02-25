
module.exports = decorator

function decorator(req, res, options) {
  // NOTE: this should get defined higher up and use some cahcing once a stable
  // prototype for res-haiku is settled.
  var haiku = require('./')(options)

  return handler

  function handler(url, code, context){
    // defaults
    code = code || 200
    context = context || {}

    // arg srubbing
    for (var i = 0; i < arguments.length; i ++){
      var arg = arguments[i]
      switch (typeof arg) {
        case 'string':
          url = arg
          break
        case 'number':
          code = arg
          break
        case 'object':
          context = arg
          break
      }
    }

    haiku.get(url, function(err, page){
      // TODO: do something better here (use error-page if defined)
      if (err) throw err
      if (! page) return notfound(req, res)

      res.statusCode = code
      res.setHeader('content-type', page.mime)
      // TODO: writeHead here

      haiku.render(page, context, function(err, output){
        // TODO: do something better here (use error-page if defined)
        if (err) throw err

        res.write(output)
        res.end()
      })
    })
  } // handler
}

function notfound(req, res){
  // TODO: only respond with text/plain when the accept header says it's okay
  res.writeHead(404, { 'content-type': 'text/plain' })
  res.write('this is a blank page\n')
  res.write('the entity is missing\n')
  res.write('but there are others\n')
  res.end()
}
