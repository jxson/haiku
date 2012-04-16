var EE2 = require('eventemitter2').EventEmitter2
;

var server = new EE2({ wildcard: true
  , delimiter: ' '
});

server.on('foo *', function(val){
  console.log('foo', arguments);
  console.log('this.event', this.event);
  console.log('this', this);
})

server.emit('foo bar')
server.emit('foo baz')