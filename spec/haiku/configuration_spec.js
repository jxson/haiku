var Configuration = require('haiku/configuration')
  , colors = require('colors')
  , _ = require('underscore')
;

describe('Configuration', function(){
  describe('#set(attrs)', function() {
    it('should allow the source to be set', function() {

    });

    _.each(['contentdir', 'templatesdir', 'publicdir'], function(setting){
      it('should not allow ' + setting + ' to be set', function() {

      });
    });
  });

  describe('defaults', function() {
    it('should have the contentdir === "content"', function() {

    });

    it('should have the templatesdir === "templates"', function() {

    });

    it('should have the publicdir === "public"', function() {

    });
  });
});
