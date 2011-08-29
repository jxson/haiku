
var _ = require('underscore')
  , util = require('util')
  // , events = require('eventemitter2')
  , events = require('events');
;

// Orgami provides a way to inherit, similar to backbone.js models, only using node.js conventions and eventemmiter2

var Origami = function(attributes){
  var attributes = attributes || {};

  this.attributes = {};

  if (this.defaults) _.defaults(attributes, this.defaults);

  this.set(attributes);

  this.initialize(attributes);

  events.EventEmitter.call(this);
};

util.inherits(Origami, events.EventEmitter);

Origami.prototype.initialize = function(attributes){};

Origami.prototype.get = function(attr){
  return this.attributes[attr];
};

Origami.prototype.set = function(attrs){
  if (!attrs) return;

  // run validations if defined
  if (this.validate && this._doesNotPassValidations(attrs)){
    // console.log('INVALID');
    return false;
  };

  // TODO: check for changes and fire a change event
  _.extend(this.attributes, attrs);
};

Origami.prototype._passesValidations = function(attrs){
  // remove any previous errors
  delete this.errors;

  // merge a clone of the attributes property and the passed in attrs so the
  // validate method can get the whole picture
  var attrs = attrs || {}
    , checkAttrs = _(this.attributes).chain().clone().extend(attrs).value();
  ;

  // this will populate the error object if anything is invalid
  this.validate(checkAttrs);

  if (_.size(this.errors)){
    return false;
  } else {
    return true;
  }
};

Origami.prototype._doesNotPassValidations = function(attrs){
  return !this._passesValidations(attrs);
};

Origami.prototype.addError = function(hash){
  this.errors = this.errors || {};

  _.extend(this.errors, hash);
};

Origami.prototype.isValid = function(){
  return !! !_.size(this.errors);
};

// // Mostly borrowed from backbone.js and refactored for the sake of comprehension
Origami.extend = function(properties, classProperties){
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

exports = module.exports = Origami;
