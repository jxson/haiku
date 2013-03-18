var haiku = require('../../')
  , assert = require('assert')
  , path = require('path')

describe('haiku.configure(options)', function(){
  beforeEach(function(){ haiku.reset() })

  it('sets haiku.root', function(){
    haiku.configure({ root: '../' })

    assert.equal(haiku.root, path.resolve(process.cwd(), '../'))
  })

  it('sets haiku["log-level"]', function(){
    haiku.configure({ 'log-level': 'debug' })

    assert.equal(haiku['log-level'], 'debug')
  })
})