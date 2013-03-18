var haiku = require('../../')
  , assert = require('assert')
  , test = it

describe('haiku.defaults', function(){
  var defaults

  before(function(){
    defaults = haiku.defaults
  })

  test('root', function(){
    assert.equal(defaults.root, process.cwd())
  })

  test('content-dir', function(){
    assert.equal(defaults['content-dir'], 'content')
  })

  test('build-dir', function(){
    assert.equal(defaults['build-dir'], 'build')
  })

  test('templates-dir', function(){
    assert.equal(defaults['templates-dir'], 'templates')
  })

  test('log-level', function(){
    assert.equal(defaults['log-level'], 'warn')
  })
})