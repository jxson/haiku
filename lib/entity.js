/*

* in - extracted frome the filename
* url - determined by the media-type which MAY be unknown until the meta is extracted from the file
* out - determined by resovling the build-dir and the url
* meta - extracted from the front-matter after file is read

# Render lifecycle

NOTE: look up jekyll content

* body - the raw data for the file
* compile mustache and look for/ add partials
* render before transforms
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
