
var path = require('path')

module.exports = { __opts__: { value: {}, writable: true }
, defaults: { value: { root: process.cwd() } }
, root: { set: setRoot
  , get: getRoot
  }
}

function setRoot(root){
  this.__opts__.root = path.resolve(root)
}

function getRoot(){
  return this.__opts__.root || this.defaults.root
}
