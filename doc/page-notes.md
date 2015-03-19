step one:

* filename
* basedir

step two

* stats

step three:

* meta
* body

Notes:

* meta: {} - set by user
* name: basedir, filename
* url: name (basedir, filename), content-type (meta['content-type'], name)
* title: slug (url, name), meta.title
* date: meta.date || times.mtime?
* draft: meta.draft
* last-modified: page.stats.mtime || times.mtime?
* content-type: meta, url (...)
* etag: stats.ino, stats.mtime, stats.size
    ino - the file serial number, which distinguishes this file from all other files on the same device.
    mtime - The last modification time for the file, in seconds.
    size - The size of a regular file in bytes.

    stats can be ditched by using the md5 of the rendered text but that
    might be a bad idea since internal caching can be based on stats

    although size might be moot since that would be pre-render, instead

    filename
    mtime
    rendered output

* outfile: url
* template: page.body
