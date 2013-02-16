
module.exports = has

function has(url){
  var haiku = this

  if (! haiku.pages) return false
  else return !! haiku.pages[url]
}
