
const haiku = require('../')
    , assert = require('assert')
    , path = require('path')

describe('h.opt(option, [value])', function(){
  var h

  beforeEach(function(){
    h = haiku()
  })


  describe('src', function(){
    it('defaults to `process.cwd()`', function(){
      assert.equal(h.opt('src'), process.cwd())
    })

    it('sets with an absolute path', function(){
      h.opt('src', '/foo/bar/baz')

      assert.equal(h.opt('src'), '/foo/bar/baz')
    })

    it('sets with a relative path', function(){
      var resolved = path.resolve(process.cwd(), '../')

      h.opt('src', '../')

      assert.equal(h.opt('src'), resolved)
    })
  })

  describe('content-dir', function(){
    it('defaults to h.opt("src") + "/content"', function(){
      var expected = path.resolve(h.opt('src'), 'content')

      assert.equal(h.opt('content-dir'), expected)
    })

    it('sets with an absolute path', function(){
      h.opt('content-dir', '/foo/content')

      assert.equal(h.opt('content-dir'), '/foo/content')
    })

    it('sets with a relative path', function(){
      var resolved = path.resolve(process.cwd(), 'random-content')

      h.opt('content-dir', './random-content')

      assert.equal(h.opt('content-dir'), resolved)
    })
  })

  describe('build-dir', function(){
    it('defaults to h.opt("src") + "/build"', function(){
      var expected = path.resolve(process.cwd(), 'build')

      assert.equal(h.opt('build-dir'), expected)
    })


    it('sets with an absolute path', function(){
      h.opt('build-dir', '/var/www')

      assert.equal(h.opt('build-dir'), '/var/www')
    })

    it('sets with a relative path', function(){
      var resolved = path.resolve(process.cwd(), './www')

      h.opt('build-dir', './www')

      assert.equal(h.opt('build-dir'), resolved)
    })
  })

  describe('templates-dir', function(){
    it('defaults to h.opt("src") + "/templates"', function(){
      var expected = path.resolve(process.cwd(), 'templates')

      assert.equal(h.opt('templates-dir'), expected)
    })

    it('sets with an absolute path', function(){
      h.opt('templates-dir', '/foo/views')

      assert.equal(h.opt('templates-dir'), '/foo/views')
    })

    it('sets with a relative path', function(){
      var resolved = path.resolve(process.cwd(), 'mustaches')

      h.opt('templates-dir', './mustaches')

      assert.equal(h.opt('templates-dir'), resolved)
    })
  })

  describe('public-dir', function(){
    it('defaults to h.opt("src") + "/public"', function(){
      var expected = path.resolve(process.cwd(), 'public')

      assert.equal(h.opt('public-dir'), expected)
    })

    it('sets with an absolute path', function(){
      h.opt('public-dir', '/foo/assets')

      assert.equal(h.opt('public-dir'), '/foo/assets')
    })

    it('sets with a relative path', function(){
      var resolved = path.resolve(process.cwd(), 'static')

      h.opt('public-dir', './static')

      assert.equal(h.opt('public-dir'), resolved)
    })
  })
})
