
const assert = require('assert')
    , request = require('supertest')
    , server = require('./source/server')
    , cheerio = require('cheerio')

describe('res.haiku(url)', function(){
  it('404s non-existing content', function(done){
    request(server)
    .get('/non-existing')
    .expect(404, done)
  })
})
