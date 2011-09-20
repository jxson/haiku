var colors = require('colors')
  , _ = require('underscore')
;


// this is a quick-and-dirty logger. there are other nicer loggers out there
// but the ones i found were also somewhat involved. this one has a Ruby
// logger type interface and color codes the console output
//
// we can easily replace this, provide the info, debug, etc. methods are the
// same. or, we can change Haiku to use a more standard node.js interface

var Logger = function(options) {
  var logger = this;

  this.level = options.level;
  this.colors = options.colors||this.colors;

  switch(this.level){
    case "debug":
      this.debug = function(message) { this.log("warn",message); }

      _.each(['info', 'warn'], function(level){
        logger[level] = function(message){ logger.log(level, message) }
      });
    case 'info':
      _.each(['info', 'warn'], function(level){
        logger[level] = function(message){ logger.log(level, message) }
      });
    case "warn":
      this.warn = function(message) { this.log("warn",message); }
      break;
  }

  if (options.module) {
    this.prefix = options.module + ": ";
  } else { this.prefix = ""; }
}

Logger.prototype = {
  log: function(level,message) {
    console[level]((this.prefix+message)[this.colors[level]]);
  },
  info: function(message) {},
  debug: function(message) {},
  warn: function(message) {},
  error: function(message) { this.log("error",message); },
  colors: {
    info: "green",
    warn: "yellow",
    debug: "orange",
    error: "red"
  }
};

module.exports = Logger;