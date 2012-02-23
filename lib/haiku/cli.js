var CLI
;

CLI = function(options){
  var cli = this
  ;

  cli.options_ = [];
};

CLI.prototype.option = function(params){
  // require flag
  // options can be
  var cli = this
    , params = params || {}
  ;

  // verify the flag
  if (! params.flag) throw new Error('invalid arguments for cli.option()');

  cli.options_.push(params)
};

CLI.prototype.command = function(){
};

CLI.prototype.dispatch = function(){
};

CLI.prototype.parse = function(){
};

module.exports = new CLI();
module.exports.CLI = CLI;
