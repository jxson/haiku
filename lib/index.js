
var url = require('url')
  , walk = require('./walk')
  , path = require('path')
  , directories = { content: path.join(process.cwd(), 'content') }
  , _index = 'index.html'
  , pages = []
  , extensions = { '.md': '.html'
    , '.markdown': '.html'
    , '.mdown': ".html"
    , '.mustache': '.html'
    , '.mkdn': '.html'
    , '.mkd': '.html'
    }
  , fs = require('graceful-fs')
  , beardo = require('beardo')
  , fm = require('front-matter')


  , colors = require('colors')

  // allow hogan overrides

module.exports = read

function route(){
  var page = this
    , uri = page.pathname.replace(directories.content, '')

  Object.keys(extensions).forEach(function(extension){
    uri = uri.replace(extension, extensions[extension])
  })

  return uri
}

function pagify(file){
  Object.defineProperties(file, {
    route: { enumerable: true
    , get: route
    }
  , render: { enumerable: true
    , value: render
    }
  , attributes: { enumerable: true
    , get: function(){ return fm(this.data).attributes }
    }
  , body: { enumerable: true
    , get: function(){ return fm(this.data).body }
    }
  , read: { enumerable: true
    , value: function(){}
    }
  , name: { enumerable: true
    , get: function(){
        return this.pathname.replace(directories.content, '')
      }
    }
  })

  return file
}

function render(context, calllback){
  var page = this
    , context = context || {}
    , template = beardo.add(page.name, page.body)

  if (typeof context === 'function') {
    callback = context
    context = {}
  }

  // fake content
  context.content = [ {title: 'hi' } ]

  // figure out the layout
  // configure the context
  //
  //  * content
  //  * pages
  //  * meta
  //  * body

  // * need layouts

  // beardo needs a way to distinguish templates that need reading vs
  // ones that were added manually

  Object.keys(page.attributes).forEach(function(k){
    context[k] = page.attributes[k]
  })

  beardo.render(page.name, context, callback)
}

///////

function read(name, callback){
  var name = name || ''
    , callback = callback || function(){}

  if (typeof name === 'function') {
    callback = name
    name = ''
  }

  if (name === '') name = '/'

  console.log('name:'.magenta, name)

  walk(directories.content)
  .on('file', function(file){
    // console.log('file'.grey, file.pathname)
    pages.push(pagify(file))
  })
  .on('dir', function(dir){
    // console.log('dir'.grey, dir.pathname)
  })
  .on('error', function(err){
    throw err
  })
  .on('end', function(){
    console.log('Done reading!'.green)

    // try and find it:
    var possibilitites = pages.filter(function(page, index, array){
      return page.route === name ||
        page.route === path.join(name, _index)
    })

    if (possibilitites.length > 0) {
      var page = possibilitites[0]

      callback(null, possibilitites[0])
    } else {
      callback(new Error('NOT FOUND'))
    }
  })

  //////////////////////////////////////////////////////////////////////

  // , hogan = require('hogan.js')
  // , template = hogan.compile("{{#content}} {{.}} eh: {{ eh }} {{/content}}")

  // var _url = url.parse(id)
  //   , uri = _url.pathname

  // checking custom iterators through mustache

  // var content = Object.create(Array.prototype)

  // try a normal array with defined properties

  // var content = new Array()
  //
  // Object.defineProperty(content, 'eh', { enumerable: true
  // , configurable: false
  // , writable: false
  // , value: 'yeah'
  // })
  //
  // console.log('content.eh', content.eh)

  // var content = Object.create({
  //       push: function(item){
  //         this._collection = this._collection || []
  //
  //         this._collection.push(item)
  //       },
  //       forEach: function(iterator){
  //         console.log('forEach')
  //         this._collection.forEach(iterator)
  //       }
  //     })

  // from the hogan template
  // find values with normal names
  // f: function(key, ctx, partials, returnFound) {
  //   var val = false,
  //       v = null,
  //       found = false;
  //
  //   for (var i = ctx.length - 1; i >= 0; i--) {
  //     v = ctx[i];
  //     if (v && typeof v == 'object' && key in v) {
  //       val = v[key];
  //       found = true;
  //       break;
  //     }
  //   }
  //
  //   if (!found) {
  //     return (returnFound) ? false : "";
  //   }
  //
  //   if (!returnFound && typeof val == 'function') {
  //     val = this.lv(val, ctx, partials);
  //   }
  //
  //   return val;
  // },

  // content.push(666)
  //
  // console.log('mustached'.magenta, template.render({ content: content }))

  // var files = {}
  //   , dirs = {}
  //
  // console.log('calling walk'.grey, directories.content)
  //
  // walk(directories.content)
  // .on('file', function(file, stats){
  //   files[file] = stats
  //   console.log('file'.grey, file)
  // })
  // .on('dir', function(dir, stats){
  //   dirs[dir] = stats
  //   console.log('dir'.yellow, dir)
  //   /*
  //
  //   Really what I want here is a dir and a list of its files to read
  //   into the context
  //
  //   */
  // })
  // .on('end', function(stats){
  //   console.log('DONE!'.green)
  // })
  // .on('error', function(err){
  //   console.log('err', err)
  // })

  // content: []
  // conent.foo: []
}

// Server needs a way to read or re-read then watch the haiku then serve
// results for the routes otherwise just serve directly out of the public
// dir
//
// haiku.server
// haiku.build
// haiku.read(dir or file)
//
// haiku.config(config)
// haiku.has(route)
//
// conent object has
//
// * A file list
// * an iterator for each dir
