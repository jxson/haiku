
var haiku = require('../../')
  , assert = require('assert')

describe('h.options', function(){
  it('has sane defaults', function(){
    var options = haiku().options

    assert.equal(options['src'], process.cwd())
    assert.equal(options['content-dir'], 'content')
    assert.equal(options['build-dir'], 'build')
    assert.equal(options['templates-dir'], 'templates')
    assert.equal(options['public-dir'], 'public')
  })
})
