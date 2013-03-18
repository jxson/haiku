var haiku = require('../../')
  , assert = require('assert')
  , path = require('path')

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
