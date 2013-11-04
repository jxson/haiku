
const haiku = require('../')
    , assert = require('assert')
    , resolve = require('./resolve')
    , through = require('through2')

describe('haiku.transform(transform)', function(){
  it('applies transforms on page render', function(done){
    haiku(resolve.src)
    .transform(uppercase)
    .get('/simple.txt', function(err, page){
      page.render(function(err, rendered){
        if (err) return done(err)
        assert.equal(rendered, 'JUST SOME TEXT.')
        done()
      })
    })
  })

  it('applies markdown transform automatically', function(done){
    haiku(resolve.src)
    .transform(uppercase)
    .get('/index.html', function(err, page){
      page.render(function(err, rendered){
        if (err) return done(err)

        assert.ok(rendered.match('<p>JUST AN INDEX.</p>'))
        done()
      })
    })
  })
})

function uppercase(page){

  return through(function(chunk, enc, callback){
    var transformed = String(chunk).toUpperCase()
    var buffer = require('buffer').Buffer

    this.push(new Buffer(transformed))
    callback()
  })
}


// var browserify = require('../');
// var vm = require('vm');
// var test = require('tap').test;
// var through = require('through');

// test('function transform', function (t) {
//     t.plan(7);

//     var b = browserify(__dirname + '/tr/main.js');
//     b.transform(function (file) {
//         return through(function (buf) {
//             this.queue(String(buf)
//                 .replace(/AAA/g, '5')
//                 .replace(/BBB/g, '50')
//             );
//         })
//     });
//     b.bundle(function (err, src) {
//         vm.runInNewContext(src, { t: t });
//     });
// });
