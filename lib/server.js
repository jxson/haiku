
var http = require('http')
  , haiku = require('./')

module.exports = server

function server(options){
  haiku(function(err, page){
    console.log('page', page.render())
  })

  // create server

  // on listen fire up the haiku watcher

  // on requests serve from static
  // or serve rendered page

  // return http.createServer(function(req, res){
  //   haiku(req.url, function(err, page){
  //
  //     console.log('page', page)
  //
  //     res.end('HI')
  //   })
  // })


    // haiku.read(req.url, function(err, page){
    //   if (err) {
    //     console.error('err:', err)
    //
    //     res.statusCode = 500
    //     res.end(err.stack)
    //
    //     return
    //   }
    //
    //   if (! page) {
    //     res.statusCode = 404
    //     res.end('Not found')
    //
    //     return
    //   }
    //
    //   res.end(page.render())
    // })

    // req.pipe(haiku(req.url)).pipe(res)
  // })
}