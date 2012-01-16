var plugin = module.exports
;

plugin.name = 'build command';

plugin.attach = function(){
  var app = this
    , commander = app.commander
  ;

  commander
    .command('build')
};