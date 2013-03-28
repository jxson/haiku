
var haiku = require('../../')
  , assert = require('assert')

describe('h.configure(options)', function(){
  // describe('haiku.defaults', function(){
  //   var defaults
  //
  //   before(function(){
  //     defaults = haiku.defaults
  //   })
  //
  //   test('root', function(){
  //     assert.equal(defaults.root, process.cwd())
  //   })
  //
  //   test('content-dir', function(){
  //     assert.equal(defaults['content-dir'], 'content')
  //   })
  //
  //   test('build-dir', function(){
  //     assert.equal(defaults['build-dir'], 'build')
  //   })
  //
  //   test('templates-dir', function(){
  //     assert.equal(defaults['templates-dir'], 'templates')
  //   })
  //
  //   test('log-level', function(){
  //     assert.equal(defaults['log-level'], 'warn')
  //   })
  // })

  // beforeEach(function(){ haiku.reset() })
  //
  // it('sets haiku.root', function(){
  //   haiku.configure({ root: '../' })
  //
  //   assert.equal(haiku.root, path.resolve(process.cwd(), '../'))
  // })
  //
  // it('sets haiku["log-level"]', function(){
  //   haiku.configure({ 'log-level': 'debug' })
  //
  //   assert.equal(haiku['log-level'], 'debug')
  // })
})

// describe('haiku["content-dir"]', function(){
//   before(function(){
//     haiku.reset()
//   })
//
//   it('defaults to an absolute "content" path', function(){
//     assert.equal(haiku['content-dir']
//     , path.join(haiku.root, 'content'))
//   })
//
//   it('is settable', function(){
//     haiku['content-dir'] = '/some/place/else'
//
//     assert.equal(haiku['content-dir'], '/some/place/else')
//   })
//
//   it('adheres to the robustness principle', function(){
//     haiku['content-dir'] = '../idunno'
//
//     assert.equal(haiku['content-dir'], path.resolve('../idunno'))
//   })
// })
