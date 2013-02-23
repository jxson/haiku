
var beardo = require('beardo')
  , path = require('path')
  , fm = require('front-matter')
  , _index = 'index.html'
  , extensions = { '.md': '.html'
    , '.markdown': '.html'
    , '.mdown': ".html"
    , '.mustache': '.html'
    , '.mkdn': '.html'
    , '.mkd': '.html'
    }

module.exports = pagify

function pagify(attrs, haiku){
  Object.defineProperties(attrs, {
    url: { enumerable: true
    , get: url
    }
  // , render: { enumerable: true
  //   , value: render
  //   }
  // , attributes: { enumerable: true
  //   , get: function(){ return fm(this.data).attributes }
  //   }
  // , body: { enumerable: true
  //   , get: function(){ return fm(this.data).body }
  //   }
  // , read: { enumerable: true
  //   , value: function(){}
  //   }
  , name: { enumerable: true
    , get: name
    }
  })

  attrs.haiku = haiku

  return attrs
}

function url(){
  var page = this
    , haiku = page.haiku
    , uri = page.path.replace(haiku['content-dir'], '')

  Object.keys(extensions).forEach(function(extension){
    // TODO: stop looping if an extension matches
    uri = uri.replace(extension, extensions[extension])
  })

  return uri
}

function name(){
  var page = this
    , haiku = page.haiku

  return page
  .path
  .replace(haiku['content-dir'], '')
  .replace(/^\//, '') // trims leading slash, should use path.sep
}
