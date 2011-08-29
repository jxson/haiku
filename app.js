var path = require('path');

require.paths.unshift(path.join(__dirname, 'lib'));


var express = require('express')
  , _ = require('underscore')
  , Haiku = require('haiku')
;

var app = express.createServer()
  , haiku = new Haiku({
              source: path.resolve(path.join('examples', 'basic'))
            })
;

// app.configure(function(){
//   app.set('views', __dirname + '/views');
//   app.set('view engine', 'jade');
//   app.use(express.bodyParser());
//   app.use(express.methodOverride());
//   app.use(app.router);
//   app.use(express.static(__dirname + '/public'));
// });
//
// app.configure('development', function(){
//   app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
// });

app.get('/', function(req, res){
  // var source = path.resolve(path.join('examples', 'basic'));
  // var site = haiku.read(source);
  //
  // // console.log('source', source);
  //
  // console.log('site\n', site);
  //
  // var index = site.find(function(content){
  //   // console.log('content \n'.yellow, content);
  //   return content.url() === 'index.html';
  // }).first();
  //
  // console.log('index \n'.magenta, index);
  //
  // res.send(index.render())

  var index = haiku.content.find(function(content){
        return content.url() === 'index.html';
      }).first().value();

  res.send('HI')
});

haiku.on('ready', function(){
  app.listen(8080);
});

haiku.read();

