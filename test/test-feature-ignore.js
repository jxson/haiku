var path = require('path')
  , haiku = path.join(__dirname, '..', 'bin', 'haiku')
  , run = require('comandante')
  , root = path.join(__dirname, 'fixtures', 'ignores')
  , assert = require('assert')
  , reader = require('./support/reader')
  , read = reader({ cwd: root })

describe('ignores', function(){
  before(function(done){
    run(haiku, [ 'build' ], { cwd: root })
    .on('error', done)
    .on('end', done)
  })

  it('ignores .dot files', function(done){
    require('fs')
    .readdir(path.join(root, 'build'), function(err, files){
      if (err) return done(err)
      assert.equal(files.length, 1, 'build includes hidden files')
      done()
    })
  })
})