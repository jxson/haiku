
const path = require('path')
const source = path.resolve(__dirname, './source')

// a short helper for resovling to haiku's test/source directory
module.exports = resolve

function resolve(pathname) {
  if (pathname === 'source') return source
  else return path.join(src, pathname)
}
