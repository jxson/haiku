var CLI
;

CLI = function(options){
  var cli = this
  ;

  // Use an object
  cli.options_ = [];
  cli.routes_ = {};
};

CLI.prototype.option = function(params){
  // require flag
  // options can be
  var cli = this
    , params = params || {}
  ;

  // verify the flag
  if (! params.flag) throw new Error('invalid arguments for cli.option()');

  cli.options_.push(params);

  return cli;
};

CLI.prototype.command = function(route){
  var cli = this
  ;
  // route delimiter space vs slash

  cli.routes_[route] = {};

  return cli;
};

CLI.prototype.dispatch = function(){
};

CLI.prototype.parse = function(){
};

module.exports = new CLI();
module.exports.CLI = CLI;
