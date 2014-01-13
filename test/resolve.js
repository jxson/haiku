
const path = require('path')

// a short helper for resovling to haiku's test/source directory
module.exports = function(pathname) {
  var src = path.resolve(__dirname, './source')

  if (pathname === 'src') return src
  else return path.join(src, pathname)
}


