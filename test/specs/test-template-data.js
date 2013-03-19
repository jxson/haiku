
var assert = require('assert')
  , run = require('comandante')
  , path = require('path')
  , root = path.join(__dirname, 'template-data')
  , haiku = path.join(__dirname, '..', '..', 'bin', 'haiku')
  , cheerio = require('cheerio')
  , reader = require('../helpers/reader')
  , read = reader({ cwd: root })

describe('template/mustache data', function(){
  before(function(done){
    run(haiku, [ 'build' ], { cwd: root })
    .on('error', done)
    .on('end', done)
  })

  describe('{{#content}}', function(){
    var $

    before(function(done){
      // Wrap this in a promise?
      read('/content-list.html', function(err, data){
        if (err) return done(err)
        else done(null, $ = cheerio.load(data))
      })
    })

    it('lists pages inside the --content-dir')

    it('does not include the index files')

    it('sorts by date')
  })

  describe('{{#content/sub-directories}}', function(){
    it('lists pages in the --content-dir sub-directories')
  })

  describe('{{#content/direct-page-access.md}}', function(){
    it('renders a block for the keyed page')
  })

  describe('{{#pages}}', function(){
    it('lists all pages recursively')
  })
})
