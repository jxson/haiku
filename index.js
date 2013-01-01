
var fs = require('fs')
  , path = require('path')
  , sigmund = require('sigmund')
  , directories = require('./directories')
  , haiku = {}
  , LRU = require('lru-cache')
  , cache = LRU({ max: 500 // revisit this
    , length: function(n){ return n.length }
    })
  , frontmatter = require('front-matter')
  , Page
  , beardo = require('./beardo')
  , marked = require('marked')

Page = function Page(data){
  var page = {}
    , extract = frontmatter(data)

  page.context = extract.attributes
  page.body = extract.body
  page.markdown = marked(extract.body)

  // page.render = function render(context){
  //   var context = context || {}
  //
  //   Object.keys(context).forEach(function(key){
  //     page.context[key] = context[key]
  //   })
  // }

  //   page.template = hogan.compile(page.markdown)

  //     page.context.yield = page.template.render(page.context, haiku.templates)

  //     return templates['layouts/default'].render(page.context, templates)
  //   }

  return page
}

haiku.read = function read(name, callback){
  var file = path.join(directories.content, name + '.md')

  fs.stat(file, function(err, stats){
    if (err) return callback(err)

    var key = sigmund([ stats.ino
        , stats.mtime
        , stats.size
        ])
      , cached = cache.get(key)

    if (cached) return callback(null, cached)

    // cache should check everything not just this file

    // console.log('key:', key)

    fs.readFile(file, 'utf8', function(err, data){
      if (err) return callback(err)

      var page = Page(data)
        , count = 2

      beardo('layouts/default', function(err, layout){
        if (err) callback(err)

        beardo.compile(page.body, function(err, template){
          page.context.yield = function yield(){
            return marked(template.render(page.context))
          }

          page.render = function(){
            return layout.render(page.context)
          }

          // console.log('layout:', layout)

          callback(null, page)
        })
      })

      // beardo.add(page.markdown, function(err, template){
      //   page.template = template
      //
      //   beardo('layouts/default', function(err, layout){
      //     page.render = function render(context){
      //       var context = context || {}
      //
      //       Object.keys(context).forEach(function(key){
      //         page.context[key] = context[key]
      //       })
      //
      //       page.context.yield = function yield(){
      //         // body...
      //       }
      //     }
      //
      //     // template.render(page.context)
      //
      //     cache.set(key, page)
      //
      //     return callback(null, page)
      //   })
      // })
    })
  })
}

module.exports = haiku


// https://github.com/isaacs/templar
// http://twitter.github.com/hogan.js/
// https://github.com/mikeal/filed
// https://github.com/isaacs/st
// https://github.com/chjj/marked
// https://github.com/isaacs/node-glob

// > h.scan('Hello {{ name }}, this is a {{>partial}}').filter(function(a){ return a['tag'] === '>'})
// [ { tag: '>',
//     n: 'partial',
//     otag: '{{',
//     ctag: '}}',
//     i: 40 } ]

// get marked to avoid escaping mustache tokens