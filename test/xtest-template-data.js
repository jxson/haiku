
var assert = require('assert')
  , run = require('comandante')
  , path = require('path')
  , root = path.join(__dirname, 'fixtures', 'template-data')
  , haiku = path.join(__dirname, '..', 'bin', 'haiku')
  , cheerio = require('cheerio')
  , reader = require('./support/reader')
  , read = reader({ cwd: root })

describe('template (mustache) data', function(){
  before(function(done){
    run(haiku, [ 'build' ], { cwd: root })
    .on('error', done)
    .on('end', done)
  })


    describe('sorting', function(){
      it('sorts descending by date', function(done){
        read('/sort-by-date/index.html', function(err, html){
          if (err) return done(err)

          var $ = cheerio.load(html);

          assert.equal($('li').first().text(), 'First')
          assert.equal($('li').last().text(), 'Third')

          done()
        })
      })

      it('sorts by name', function(done){
        read('/sort-by-name/index.html', function(err, html){
          if (err) return done(err)

          var $ = cheerio.load(html);

          assert.equal($('li').first().text(), 'First')
          assert.equal($('li').last().text(), 'Third')

          done()
        })
      })
    })

    describe('page sections', function(){
      it('renders a block for the keyed page', function(done){
        read('/page-sections.html', function(err, html){
          if (err) return done(err)

          var $ = cheerio.load(html)

          assert.equal($('li').first().text(), 'Jason Campbell')
          assert.equal($('li').last().text(), 'jxson')

          done()
        })
      })
    })
  })

  describe('pages', function(){
    it('lists all pages recursively', function(done){
      read('/page-list.html', function(err, html){
        if (err) return done(err)

        var $ = cheerio.load(html)

        assert.equal($('li').length, 17)

        done()
      })
    })
  })
})
