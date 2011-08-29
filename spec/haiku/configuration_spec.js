var Configuration = require('haiku/configuration')
  , colors = require('colors')
  , _ = require('underscore')
;

describe('Configuration', function(){
  var config, set;

  beforeEach(function() {
    config = new Configuration();
  });

  describe('#set(attrs)', function() {
    it('should allow the source to be set', function() {
      config.set({ source: 'foo' });

      expect(config.attributes.source).toBe('foo');
      expect(config.get('source')).toBe('foo');
    });

    it('should not allow "contentdir" to be set', function() {
      config.set({ contentdir: 'random' });

      expect(config.isValid()).toBeFalsy();
      expect(config.errors.contentdir).toBe('is NOT configurable');
      expect(config.get('contentdir')).not.toBe('random');
    });

    it('should not allow "templatesdir" to be set', function() {
      config.set({ templatesdir: 'random' });

      expect(config.isValid()).toBeFalsy();
      expect(config.errors.templatesdir).toBe('is NOT configurable');
      expect(config.get('templatesdir')).not.toBe('random');
    });

    it('should not allow "publicdir" to be set', function() {
      config.set({ publicdir: 'random' });

      expect(config.isValid()).toBeFalsy();
      expect(config.errors.publicdir).toBe('is NOT configurable');
      expect(config.get('publicdir')).not.toBe('random');
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
