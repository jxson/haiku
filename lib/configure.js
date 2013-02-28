
module.exports = configure

// A shortcut for setting options
function configure(options){
  var haiku = this

  Object.keys(options).forEach(function(key){
    haiku[key] = options[key]
  })

  return haiku
}
