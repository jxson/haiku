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
    beforeEach(function() {
      config.set({ source: 'monkey-blog' })
    });

    it('should exist', function(){
      expect(config.contentdir).toBeDefined()
    });

    it('should be the full path the the `contentdir`', function(){
      expect(config.contentdir()).toBe('monkey-blog/content')
    });
  });

  describe('#templatesdir()', function(){
    beforeEach(function() {
      config.set({ source: 'monkey-blog' })
    });

    it('should exist', function(){
      expect(config.templatesdir).toBeDefined()
    });

    it('should be the full path the the `templatesdir`', function(){
      expect(config.templatesdir()).toBe('monkey-blog/templates')
    });
  });

  describe('#publicdir()', function(){
    beforeEach(function() {
      config.set({ source: 'monkey-blog' })
    });

    it('should exist', function(){
      expect(config.publicdir).toBeDefined()
    });

    it('should be the full path the the `templatesdir`', function(){
      expect(config.publicdir()).toBe('monkey-blog/public')
    });
  });
});
