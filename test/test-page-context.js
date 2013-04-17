var haiku = require('../')
  , pagify = require('../pagify')
  , path = require('path')
  , assert = require('assert')

describe('page.context', function(){
  describe('.title', function(){
    it('defaults to page.name')

    it('can be overridden by front-matter')
  })

  describe('.body', function(){
    it('is the un-rendered content of the page')

    it('can NOT be overridden by front-matter')
  })

  describe('.date', function(){
    it('defaults to undefined')

    it('can be overridden by front-matter')
  })

  describe('.id', function(){
    it('is a unique identifier based on page.name')

    it('can be overridden by front-matter')
  })

  describe('.url', function(){
    it('is the url for the built page')

    it('can NOT be overridden by front-matter')
  })

  describe('.next', function(){
    it('is the next page in page.dirname')
  })

  describe('.previous', function(){
    it('is the previous page in page.dirname')
  })

  it('allows arbitrary values to be defined via front-matter')
})