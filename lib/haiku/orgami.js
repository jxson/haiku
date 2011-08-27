
var _ = require('underscore')
  , util = require('util')
  , events = require('eventemitter2');
;

// Orgami provides a way to inherit, similar to backbone.js models, only using node.js conventions and eventemmiter2

var Orgami = function(argument){
  events.EventEmitter2.call(this);
};

util.inherits(Orgami, events.EventEmitter2);

// Mostly borrowed from backbone.js and refactored for the sake of comprehension
Orgami.extend = function(properties, classProperties){
  var properties = properties || {}
    , classProperties = classProperties || {}
    , parent = this
    , child
  ;

  // the constructor for the child class
  child = function(){
    return parent.apply(this, arguments)
  };

  // jam the class properties from the parent onto the child
  _.extend(child, parent);

  // set the prototype of the child
  blam = function(){};
  blam.prototype = parent.prototype;
  child.prototype = new blam();

  // add the the child's prototype properties (instance properties)
  _.extend(child.prototype, properties);

  // add classProperties to the child
  _.extend(child, classProperties);

  // Set the constructor
  child.prototype.constructor = child;

  // set the super
  child.super_ = parent.prototype;

  return child;
};

exports = module.exports = Orgami;
