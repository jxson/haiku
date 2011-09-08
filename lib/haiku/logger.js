var path = require('path');
require.paths.unshift(path.join(__dirname, '..'));

var colors = require('colors');

var Logger = function(options) {
  this.level = options.level;
  this.colors = options.colors||this.colors;
  switch(this.level){ 
    case "debug":
      this.debug = function(message) { this.log("warn",message); }
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
  info: function(message) { this.log("info",message); },
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