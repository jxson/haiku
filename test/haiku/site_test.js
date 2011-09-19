var helper = require('../test_helper')
  , vows = require('vows')
  , assert = require('assert')
  , Site = require('haiku/site')
  , Logger = require('haiku/logger')
  , path = require('path')
;

vows.describe('haiku.Site').addBatch({
  'A new instance\'s': {
    '*default* `options`': {
      topic: function(site){
        var site = new(Site);
        return site.options;
      },
      '`root` should be `process.cwd()`': function(options){
        assert.ok(options.root);
        assert.equal(options.root, process.cwd());
      },
      '`buildDir` should be "build"': function(options){
        assert.ok(options.buildDir);
        assert.equal(options.buildDir, 'build');
      },
      '`contentDir` should be "content"': function(options){
        assert.ok(options.contentDir);
        assert.equal(options.contentDir, 'content');
      },
      '`templatesDir` should be "templates"': function(options){
        assert.ok(options.templatesDir);
        assert.equal(options.templatesDir, 'templates');
      },
      '`publicDir` should be "public"': function(options){
        assert.ok(options.publicDir);
        assert.equal(options.publicDir, 'public');
      },
      '`logger` should be a logger object': function(options){
        assert.isObject(options.logger);
        assert.instanceOf(options.logger, Logger);
        assert.equal(options.logger.level, 'info');
      },
      '`index` should be "index"': function(options){
        assert.ok(options.index);
        assert.equal(options.index, 'index.html');
      }
    },
    '*default* `directories`': {
      topic: function(site){
        var site = new(Site);
        return site.directories;
      },
      'has property `content`': function(directories){
        var _path = path.join(process.cwd(), 'content');

        assert.include(directories, 'content');
        assert.equal(directories.content, _path);
      },
      'has property `templates`': function(directories){
        var _path = path.join(process.cwd(), 'templates');

        assert.include(directories, 'templates');
        assert.equal(directories.templates, _path);
      },
      'has property `public`': function(directories){
        var _path = path.join(process.cwd(), 'public');

        assert.include(directories, 'public');
        assert.equal(directories.public, _path);
      }
    }
  },
  '#read()': 'pending',
  '#find() / .resolve()': 'pending',
  '#toJSON()': 'pending',
  '#build()': 'pending'
}).export(module);
