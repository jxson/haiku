var plugin = module.exports
;

plugin.name = 'server command';

plugin.attach = function(){
  var app = this
    , commander = app.commander
  ;

  commander
    .command('server')
};