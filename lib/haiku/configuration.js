var Origami = require('haiku/origami')
  , _ = require('underscore')
;

var Configuration = Origami.extend({
  validate: function(attrs){
    // only these attribute keys are allowed
    var validSettings = ['source']
      , notAllowed = _.difference(_.keys(attrs), validSettings)
      , config = this
    ;

    _.each(notAllowed, function(key){
      var err = {};
      err[key] = 'is NOT configurable';

      config.addError(err);
    });
  }
});

exports = module.exports = Configuration;
