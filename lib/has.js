
module.exports = has

function has(url){
  var haiku = this
    , url = url === '/' ? '/index.html' : url

  if (! haiku.pages) return false
  else return !! haiku.pages[url]
}
