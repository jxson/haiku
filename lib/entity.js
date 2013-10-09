
const fm = require('front-matter')
    , path = require('path')

module.exports = function(file, data){
  return new Entity(file, data)
}

/*

Attributes:

* src: the original file path
* meta: the extracted front-matter
* content: unrendered file contents with the front-matter removed
* content-type: the content-type of the page, can be defined in the meta
* url: the url of the page
* out: full destination path, determined by resovling the build-dir and the url
* etag: unique id for the entity for proper http caching
* last-modified: last-modified obvs.

*/

function Entity(file, data, haiku){
  var entity = this

  entity.src = file

  try { var extract = fm(data) }
  catch(err) {
    var message = [ 'Bad front-matter - '
        , err.problem
        , ' - '
        , entity.src
        , ':'
        , (e.problem_mark ? e.problem_mark.line : '')
        ].join()

    throw new Error(message)
  }

  entity.meta = extract.attributes
  entity.content = extract.content
  // entity['content-type'] =
  entity['url'] = file // temporary
}
/*

# Render lifecycle

NOTE: look up jekyll content

* body - the raw data for the file
* compile mustache and look for/ add partials
* render mustache before transforms
* transform: MD, textile? // can mustache do this first?
* content - fully rendered output
  * don't apply layouts to non-html

There should be two passes, one for getting the meta and one for streaming the file contents (minus the yaml) through the transforms

  h.transform(function(entity){
    return concatStream(function(data) {
      return marked(data)
    })
  })

later:

  h.get(url, function(entity) {
    entity.render(context).pipe(process.stdout)
  })

OR:

  h.get(url, function(entity) {
    entity.render(context, function(err, out){
      console.log(out)
    })
  })

OR

  haiku()
  .read()
  .pipe(build)
  .pipe(upload)

*/
