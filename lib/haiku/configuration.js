var Origami = require('haiku/origami')
  , _ = require('underscore')
  , path = require('path')
;

var Configuration = Origami.extend({
  defaults: {
      contentdir: 'content'
    , templatesdir: 'templates'
    , publicdir: 'public'
  },

  // Validate function run when Configuration is initialized or when
  // #set(attrs) is called.
  //
  // It makes sure that the `contentdir`, `templatesdir`, and `publicdir` can
  // only be set to the defaults
  validate: function(attrs){
    var allowed
      , allowedKeys
      , config = this
    ;

    allowed = {
        contentdir: 'content'
      , templatesdir: 'templates'
      , publicdir: 'public'
    };

    allowedKeys = _.keys(allowed);

    _.each(attrs, function(value, key){
      if (_.include(allowedKeys, key) && value !== allowed[key]){
        var err = {};
        err[key] = 'is NOT configurable';

        config.addError(err);
      }
    });
  },

  // Returns the full path to the `contentdir`
  contentdir: function(){
    // TODO: warn that the config isn't set up properly
    if (! this.get('source')) return;

    return path.join(this.get('source'), this.get('contentdir'));
  },

  // Returns the full path to the `templatesdir`
  templatesdir: function(){
    // TODO: warn that the config isn't set up properly
    if (! this.get('source')) return;

    return path.join(this.get('source'), this.get('templatesdir'));
  },

  // Returns the full path to the `publicdir`
  publicdir: function(){
    // TODO: warn that the config isn't set up properly
    if (! this.get('source')) return;

    return path.join(this.get('source'), this.get('publicdir'));
  },
});

exports = module.exports = Configuration;
