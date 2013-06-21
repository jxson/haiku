var path = require('path')
  , haiku = path.join(__dirname, '..', 'bin', 'haiku')
  , run = require('comandante')
  , root = path.join(__dirname, 'fixtures', 'content-types')
  , assert = require('assert')
  , reader = require('./support/reader')
  , read = reader({ cwd: root })

describe('content types', function(){
  before(function(done){
    run(haiku, [ 'build' ], { cwd: root })
    .on('error', done)
    .on('end', done)
    .pipe(process.stdout)
  })

  it('converts vanilla markdown to html', function(done){
    read('vanilla.html', function(err, html){
      if (err) return done(err)
      assert.ok(html.match('<p>Just some HTML that was markdown</p>'))
      done()
    })
  })

  it('does not convert explicit markdown', function(done){
    read('raw.md', function(err, md){
      if (err) return done(err)
      assert.equal(md.trim(), '# just some markdown')
      done()
    })
  })

  it('does not convert files with unknown transforms', function(done){
    read('feed.atom', function(err, xml){
      if (err) return done(err)
      assert.ok(xml)
      done()
    })
  })

  it('does not convert html files', function(done){
    read('special.html', function(err, html){
      if (err) return done(err)
      assert.equal(html.trim(), '<p>Just some HTML</p>')
      done()
    })
  })
})
