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

    it('does NOT include index pages', function(){
      assert.equal($('li').length, 4)
      assert.equal($('li:contains(Content directory index)').length, 0)
    })

    describe('sub directories', function(){
      before(function(done){
        read('/posts-list.html', function(err, html){
          if (err) return done(err)
          $ = cheerio.load(html)
          done()
        })
      })

      it('iterates pages', function(){
        var posts = [ 'Post 001'
        , 'Post 002'
        , 'Post 003'
        ]

        posts.forEach(function(title){
          var selector = 'li:contains(' + title + ')'

          assert.ok($(selector).length
          , 'Missing page with title: ' + title)
        })
      })

      it('does NOT include index pages', function(){
        assert.equal($('li').length, 3)
        assert.equal($('li:contains(posts/index.md)').length, 0)
      })
    })

    describe('sorting', function(){
      it('sorts by date', function(done){
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
  })

  describe('page sections/helpers', function(){
    // NOTE: still need to work out a reasnoable scheme for doing this
    // that plays nice with mustache. Thinking about adding helpers:
    //
    //    {{#haiku(people/jxson.md)}}
    //      * {{ name }}
    //      * {{ twitter }}
    //    {{/haiku(people/jxson.md)}}
    //
    xit('renders a block for the keyed page', function(done){
      read('/page-sections.html', function(err, html){
        if (err) return done(err)

        var $ = cheerio.load(html)

        assert.equal($('li').first().text(), 'Jason Campbell')
        assert.equal($('li').last().text(), 'jxson')

        done()
      })
    })
  })

  describe('pages', function(){
    it('lists all pages recursively', function(done){
      read('/page-list.html', function(err, html){
        if (err) return done(err)

        var $ = cheerio.load(html)

        assert.equal($('li').length, 18)

        done()
      })
    })
  })
})