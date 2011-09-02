var Configuration = require('haiku/configuration')
  , colors = require('colors')
  , _ = require('underscore')
;

// TODO: move this into the haiku spec, config now uses the haiku attributes...
xdescribe('Configuration', function(){
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
    beforeEach(function() {
      config.set({ source: 'monkey-blog' })
    });

    it('should have the contentdir === "content"', function() {
      expect(config.get('contentdir')).toBe('content');
    });

    it('should have the templatesdir === "templates"', function() {
      expect(config.get('templatesdir')).toBe('templates');
    });

    it('should have the publicdir === "public"', function() {
      expect(config.get('publicdir')).toBe('public');
    });
  });

  describe('#contentdir()', function(){
    it('should exist', function(){
      expect(config.contentdir).toBeDefined()
    });

    describe('when the `source` is set', function(){
      beforeEach(function() {
        config.set({ source: 'monkey-blog' })
      });

      it('should be the full path the the `contentdir`', function(){
        expect(config.contentdir()).toBe('monkey-blog/content')
      });
    });

    describe('when the `source` is NOT set', function(){
      it('should be null', function(){
        expect(config.contentdir()).not.toBeDefined();
      });

      it('should invalidate config', function(){
        expect(config.isValid()).toBeFalsy();
        expect(config.errors.source).toBe('needs to be set');
      });
    });
  });

  describe('#templatesdir()', function(){
    it('should exist', function(){
      expect(config.templatesdir).toBeDefined()
    });

    describe('when the `source` is set', function(){
      beforeEach(function() {
        config.set({ source: 'monkey-blog' })
      });

      it('should be the full path the the `templatesdir`', function(){
        expect(config.templatesdir()).toBe('monkey-blog/templates')
      });
    });

    describe('when the `source` is NOT set', function(){
      it('should be null', function(){
        expect(config.templatesdir()).not.toBeDefined();
      });

      it('should invalidate config', function(){
        expect(config.isValid()).toBeFalsy();
        expect(config.errors.source).toBe('needs to be set');
      });
    });
  });

  describe('#publicdir()', function(){
    it('should exist', function(){
      expect(config.publicdir).toBeDefined()
    });

    describe('when the `source` is set', function(){
      beforeEach(function() {
        config.set({ source: 'monkey-blog' })
      });

      it('should be the full path the the `publicdir`', function(){
        expect(config.publicdir()).toBe('monkey-blog/public')
      });
    });

    describe('when the `source` is NOT set', function(){
      it('should be null', function(){
        expect(config.publicdir()).not.toBeDefined();
      });

      it('should invalidate config', function(){
        expect(config.isValid()).toBeFalsy();
        expect(config.errors.source).toBe('needs to be set');
      });
    });
  });
});
