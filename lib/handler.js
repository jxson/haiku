
module.exports = handler

function handler(req, res, opts){
  var haiku = this
    , opts = opts || {}

  haiku.configure(opts)

  return function h(url, context, code){
    var context = context || {}
      , code = code || 200

    /*

    If the content is in the haiku render it
    otherwise res with a 404

    */

    console.log('url', url)

    if (! haiku.has(url)) return fourofour(res)
  }
}
//     beardo.render(name, context, function(err, output){
//       var etag = hash(output)
//
//       if (req.headers['if-none-match'] === etag) {
//         res.statusCode = 304
//         res.end()
//         return
//       }
//
//       // Only set after 304 resp
//       res.setHeader('etag', etag)
//       if (stamp) res.setHeader('x-beardo-stamp', stamp)
//
//
//       // Don't override content-type header
//       if (! res.getHeader('content-type')) {
//         res.setHeader('content-type', 'text/html')
//       }
//
//       res.statusCode = code || 200
//       res.end(output)
//     })
//   }
// }
//
