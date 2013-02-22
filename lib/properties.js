
var path = require('path')

module.exports = { __opts__: { value: {}, writable: true }
, defaults: { value: { root: process.cwd()
    , 'content-dir': 'content'
    }
  }
, pages: { value: [] }
, root: { set: setRoot
  , get: getRoot
  }
, 'content-dir': { set: setContent
  , get: getContent
  }
}

function setContent(content){
  return this.__opts__['content-dir'] = path.resolve(content)
}

function getContent(){
  var haiku = this
    , opts = haiku.__opts__

  if (opts['content-dir']) return opts['content-dir']
  else return path.join(haiku.root, haiku.defaults['content-dir'])
}

function setRoot(root){
  return this.__opts__.root = path.resolve(root)
}

function getRoot(){
  return this.__opts__.root || this.defaults.root
}
