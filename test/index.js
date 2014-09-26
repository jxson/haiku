
require('fs')
.readdirSync(__dirname)
.forEach(function f(file) {
  if (file.match('test-')) require('./' + file)
})
