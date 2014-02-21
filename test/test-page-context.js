
const haiku = require('../')
    , pctx = require('../lib/page-context')
    , assert = require('assert')
    , resolve = require('./resolve')
    , src = resolve('src')
    , cheerio = require('cheerio')

// NOTE: since the `page` template variable is only assigned right before
// redering (inside the h.render() method) the best way to test it is rendering
// and verifying proper output.
describe('page template variable', function(){
  it('allows arbitrary values via front-matter', function(done){
    haiku(src)
    .render('/lumpy-space-princess.html', function(err, output){
      if (err) return done(err)

      var $ = cheerio.load(output)

      assert.equal($('h1').text(), 'Hey girl!')
      assert.equal($('p').text(), 'Oh my glob.')

      done()
    })
  })

  it('allows the expansion of pages via front-matter', function(done){
    haiku(src)
    .render('/page-expansion.html', function(err, output){
      if (err) return done(err)

      var $ = cheerio.load(output)

      assert.equal($('.expanded h2').text(), 'Hey girl!')
      assert.equal($('.expanded p').text(), 'Oh my glob.')

      done()
    })
  })

  describe('page.title', function(){
    it('Defaults to the filename sans extension', function(done){
      haiku(src)
      .render('/defaults.html', function(err, output){
        if (err) return done(err)

        var $ = cheerio.load(output)

        assert.equal($('h1').text(), 'Defaults')

        done()
      })
    })

    it('can be set via front matter', function(done){
      haiku(src)
      .render('/overrides.html', function(err, output){
        if (err) return done(err)

        var $ = cheerio.load(output)
          , page = this

        assert.equal($('h1').text(), page.meta.title)

        done()
      })
    })
  })

  describe('page.date', function(){
    it('defaults to undefined', function(done){
      haiku(src)
      .render('/basic-page.html', function(err, output){
        if (err) return done(err)

        var $ = cheerio.load(output)

        assert.equal($('.date').text(), '')

        done()
      })
    })

    it('can be set via front-matter', function(done){
      haiku(src)
      .render('/posts/one.html', function(err, output){
        if (err) return done(err)

        var page = this
          , $ = cheerio.load(output)
          , date = $(".date") ? new Date($(".date").text()) : null

        assert.ok(date, 'Missing page.date')
        assert.equal(date.getTime(), page.meta.date.getTime())

        done()
      })
    })
  })

  describe('page.url', function(){
    it('is pre-set via the Page instance', function(done){
      haiku(src)
      .render('/basic-page.html', function(err, output){
        if (err) return done(err)

        var $ = cheerio.load(output)
          , page = this

        assert.equal($('.url').text(), page.url)

        done()
      })
    })

    it('can NOT be overriden', function(done){
      haiku(src)
      .render('/overrides.html', function(err, output){
        if (err) return done(err)

        var $ = cheerio.load(output)
          , page = this

        assert.equal($('.url').text(), page.url)

        done()
      })
    })

  })
})
