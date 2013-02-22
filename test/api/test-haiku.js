
var haiku = require('../../lib')
  , assert = require('assert')
  , path = require('path')

describe('haiku', function(){
  it('exists', function(){
    assert.ok(haiku)
  })

  it('exports haiku.handler()', function(){
    assert.equal(typeof haiku.handler, 'function')
  })

  it('exports haiku.configure()', function(){
    assert.equal(typeof haiku.configure, 'function')
  })

  it('exports haiku.has()', function(){
    assert.equal(typeof haiku.has, 'function')
  })

  describe('.defaults property', function(){
    it('exists', function(){
      assert.ok(haiku.defaults)
    })

    it('has `root` property', function(){
      assert.ok(haiku.defaults.root)
      assert.equal(haiku.defaults.root, process.cwd())
    })
  })

  // Be conservative in what you do,
  // be liberal in what you accept from others
  describe('haiku.root', function(){
    before(function(){
      haiku.reset()
    })

    it('defaults to `process.cwd()`', function(){
      assert.equal(haiku.root, process.cwd())
    })

    it('is settable', function(){
      haiku.root = '/some/random/dir'

      assert.equal(haiku.root, '/some/random/dir')
    })

    it('adheres to the robustness principle', function(){
      haiku.root = '../'

      assert.equal(haiku.root, path.resolve(process.cwd(), '../'))
    })
  })

  describe('haiku["content-dir"]', function(){
    before(function(){
      haiku.reset()
    })

    it('defaults to an absolute "content" path', function(){
      assert.equal(haiku['content-dir']
      , path.join(haiku.root, 'content'))
    })

    it('is settable', function(){
      haiku['content-dir'] = '/some/place/else'

      assert.equal(haiku['content-dir'], '/some/place/else')
    })

    it('adheres to the robustness principle', function(){
      haiku['content-dir'] = '../idunno'

      assert.equal(haiku['content-dir'], path.resolve('../idunno'))
    })
  })
})
