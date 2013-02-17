var haiku = require('../../lib')
  , assert = require('assert')
  , server = require('../support/server')
  , request = require('supertest')

// this is for the cli server and not the api's http handler
// (haiku.handler)
describe('GET /favicon.io', function(){
  it('responds 200 ok')
  it('is a favicon')
})

describe('GET /bundle.js', function(){
  it('responds 200 ok')
  it('is a javascript file')
})

describe('GET /bundle.css', function(){
  it('responds 200 ok')
  it('is a css file')
})
