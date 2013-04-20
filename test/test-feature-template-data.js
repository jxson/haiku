var path = require('path')
  , haiku = path.join(__dirname, '..', 'bin', 'haiku')
  , run = require('comandante')
  , root = path.join(__dirname, 'fixtures', 'template-data')
  , assert = require('assert')
  , cheerio = require('cheerio')
  , reader = require('./support/reader')
  , read = reader({ cwd: root })


describe('template data', function(){
  var $

  before(function(done){
    run(haiku, [ 'build' ], { cwd: root })
    .on('error', done)
    .on('end', done)
  })

  describe('content', function(){
    before(function(done){
      read('/content-list.html', function(err, data){
        if (err) return done(err)
        else done(null, $ = cheerio.load(data))
      })
    })

    it('iterates pages', function(){
      [ 'Page 1'
      , 'Page 2'
      , 'Page 3'
      , 'Page 4'
      ].forEach(function(title){
        var selector = 'li:contains(' + title + ')'

        assert.ok($(selector).length
        , 'Missing page with title: ' + title)
      })
    })

    it('does NOT include index pages')

    describe('sub directories', function(){
      it('iterates pages')

      it('does NOT include index pages')
    })

    describe('sorting', function(){
      it('sorts by date')

      it('sorts by name')
    })
  })
})