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

  index = haiku.content['/index.html'];

  index.render(function(html){
    res.send(html);
  });
});

app.get(/^\/(.*)/, function(req, res){
  var key = '/' + req.params[0]
      content = haiku.content[key];
  ;

  if (content){
    content.render(function(html){
      res.send(html);
    });
  } else {
    // err
  }
});

haiku.on('ready', function(){
  console.log('haiku: \n'.magenta, haiku);

  console.log('ready!'.green);
  app.listen(8080);
});

console.log('reading...'.yellow);

haiku.read();
