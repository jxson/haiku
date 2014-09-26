
# haiku

[![NPM](https://nodei.co/npm/haiku.png)](https://nodei.co/npm/haiku/)
[![Coverage Status](https://coveralls.io/repos/jxson/haiku/badge.png?branch=v1.0)](https://coveralls.io/r/jxson/haiku?branch=v1.0)

## Another static site generator.

[![build status](https://secure.travis-ci.org/jxson/haiku.png)](http://travis-ci.org/jxson/haiku)
[![Dependency Status](https://david-dm.org/jxson/haiku.png)](https://david-dm.org/jxson/haiku)

Haiku compiles Markdown, Mustache, and any of your other assets to a static site via a CLI or a [Node.js][node] code API. This project is very much still a WIP. If you want to contribute hit me up on github or irc.

# Install

With [npm][npm] do:

    npm install haiku -g

# Example

# API Methods

    var haiku = require('haiku')

## var h = haiku([src || options])

Create an instance of haiku using the `src` path or an `options` object, if the `options` or `src` are omitted the defaults described below are applied.

* `src`: The source of the project or site, defaults to process.cwd()
* `content-dir`: the content directory where the markdown content lives. Defaults to the cwd + '/content'
* `build-dir`: where the compiled site will be saved to. Defaults to the cwd + '/build'
* `templates-dir`: layouts and additional templates go here, Defaults to the cwd + '/templates'
* `public-dir`: static content that does not need to be compiled can be saved, will get merged into the build directory at compile time. Defaults to the cwd + '/public'

## h.opt(option[, value])

Sets or gets individual haiku `options` for this instance. For getting the value of an `option`:

    h.opt('src') //=> /path/to/yoursite.com

For setting values pass in the option name and the value you want it set to:

    h.opt('src', '/var/www')

## h.get([url || name], callback)

Gets the page with the corresponding url or name. Callsback with `error` and `page` arguments.

    h.get('/index.html', function(error, page){
      if (err) throw err
      console.log(page)
    })

It is also possible to ask for pages by name:

    h.get('/my-page.md', function(error, page){
      if (err) throw err
      console.log(page)
    })

# Contributing

Haiku is an OPEN Source Project so please help out by [reporting bugs](http://github.com/jxson/haiku/issues) or [forking and opening pull](https://github.com/jxson/haiku) requests when possible.

# License MIT

SEE: [LISCENSE]

[npm]: https://npmjs.org
[node]: https://nodejs.org
