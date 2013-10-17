
const path = require('path')
    , src = path.resolve(__dirname, './source')

module.exports = resolve
module.exports.src = src

function resolve(relative){
  return path.join(src, relative)
}
