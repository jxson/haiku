
var haiku = require('../')
  , assert = require('assert')
  , path = require('path')

describe('h.opt(option, [value])', function(){
  var h

  beforeEach(function(){ h = haiku() })

  describe('src', function(){
    it('defaults to `process.cwd()`', function(){
      assert.equal(h.opt('src'), process.cwd())
    })

    it('sets with an absolute path', function(){
      h.opt('src', '/foo/bar/baz')

      assert.equal(h.opt('src'), '/foo/bar/baz')
    })

    it('sets to a resolved relative path', function(){
      h.opt('src', '../')

      assert.equal(h.opt('src'), path.resolve(process.cwd(), '../'))
    })
  })

  describe('content-dir', function(){
    it('defaults to h.opt("src") + "/content"', function(){
      assert.equal(h.opt('content-dir'), path.resolve(process.cwd(), 'content'))
    })

    it('can be set with an absolute path', function(){
      h.opt('content-dir', '/foo/content')
      assert.equal(h.opt('content-dir'), '/foo/content')
    })

    it('can be set with a relative path', function(){
      h.opt('content-dir', './content')
      assert.equal(h.opt('content-dir'), path.resolve(process.cwd(), 'content'))
    })
  })

  describe('build-dir', function(){
    it('defaults to h.opt("src") + "/build"', function(){
      assert.equal(h.opt('build-dir')
      , path.resolve(process.cwd(), 'build')
      , 'Bad default for h.opt("build-dir")')
    })


    it('can be set with an absolute path', function(){
      h.opt('build-dir', '/var/www')

      assert.equal(h.opt('build-dir'), '/var/www')
    })

    it('can be set with a relative path', function(){
      var relative = './artifacts'
        , absolute = path.resolve(process.cwd(), './artifacts')

      h.opt('build-dir', relative)

      assert.equal(h.opt('build-dir'), absolute)
    })
  })

  describe('templates-dir', function(){
    it('defaults to h.opt("src") + "/templates"', function(){
      assert.equal(h.opt('templates-dir')
      , path.resolve(process.cwd(), 'templates')
      , 'Bad default for h.opt("templates-dir")')
    })

    it('can be set with an absolute path', function(){
      h.opt('templates-dir', '/foo/views')

      assert.equal(h.opt('templates-dir'), '/foo/views')
    })

    it('can be set with a relative path', function(){
      var relative = './mustaches'
        , absolute = path.resolve(process.cwd(), './mustaches')

      h.opt('templates-dir', relative)

      assert.equal(h.opt('templates-dir'), absolute)
    })
  })

  describe('public-dir', function(){
    it('defaults to h.opt("src") + "/public"', function(){
      assert.equal(h.opt('public-dir')
      , path.resolve(process.cwd(), 'public')
      , 'Bad default for h.opt("public-dir")')
    })

    it('can be set with an absolute path', function(){
      h.opt('public-dir', '/foo/assets')

      assert.equal(h.opt('public-dir'), '/foo/assets')
    })

    it('can be set with a relative path', function(){
      var relative = './static'
        , absolute = path.resolve(process.cwd(), './static')

      h.opt('public-dir', relative)

      assert.equal(h.opt('public-dir'), absolute)
    })
  })

  describe('log-level', function(){
    it('defaults to warn', function(){
      assert.equal(h.opt('log-level'), 'warn')
    })

    it('is settable', function(){
      h.opt('log-level', 'error')

      assert.equal(h.opt('log-level'), 'error')
    })
  })
})
